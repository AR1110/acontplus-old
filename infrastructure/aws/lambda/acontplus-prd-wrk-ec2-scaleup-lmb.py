"""
Lambda Function: acontplus-prd-wrk-ec2-scaleup-lmb
Description: Scales up EC2 instance to t3.medium (morning workload)
Instance: i-051e94df5bca54c9f
Schedule: 6am Ecuador (11:00 UTC) Mon-Fri
Naming Convention: {prefix}-{env}-{app-type}-{service-name}-{aws-service}
Created: 2026-02-01
"""
import boto3
import json
import logging

# Initialize logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Configuration
REGION = 'us-east-1'
INSTANCE_ID = 'i-051e94df5bca54c9f'
TARGET_INSTANCE_TYPE = 't3.medium'

ec2 = boto3.client('ec2', region_name=REGION)


def lambda_handler(event, context):
    """
    Stops the instance, changes type to t3.medium, and starts it again.
    Used for scaling up during business hours.
    """
    logger.info(f"Starting scale-up process for instance {INSTANCE_ID} to {TARGET_INSTANCE_TYPE}")

    try:
        # Get current instance state
        response = ec2.describe_instances(InstanceIds=[INSTANCE_ID])
        current_state = response['Reservations'][0]['Instances'][0]['State']['Name']
        current_type = response['Reservations'][0]['Instances'][0]['InstanceType']

        logger.info(f"Current state: {current_state}, Current type: {current_type}")

        # If already the target type, just ensure it's running
        if current_type == TARGET_INSTANCE_TYPE:
            if current_state != 'running':
                ec2.start_instances(InstanceIds=[INSTANCE_ID])
                waiter = ec2.get_waiter('instance_running')
                waiter.wait(InstanceIds=[INSTANCE_ID])
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': f'Instance {INSTANCE_ID} already {TARGET_INSTANCE_TYPE}, ensured running.',
                    'instance_id': INSTANCE_ID,
                    'instance_type': TARGET_INSTANCE_TYPE
                })
            }

        # Stop the instance if running
        if current_state == 'running':
            logger.info(f"Stopping instance {INSTANCE_ID}")
            ec2.stop_instances(InstanceIds=[INSTANCE_ID])
            waiter = ec2.get_waiter('instance_stopped')
            waiter.wait(InstanceIds=[INSTANCE_ID])
            logger.info(f"Instance {INSTANCE_ID} stopped")
        elif current_state != 'stopped':
            # Wait for it to be in a stable state
            waiter = ec2.get_waiter('instance_stopped')
            waiter.wait(InstanceIds=[INSTANCE_ID])

        # Change instance type
        logger.info(f"Modifying instance type to {TARGET_INSTANCE_TYPE}")
        ec2.modify_instance_attribute(
            InstanceId=INSTANCE_ID,
            InstanceType={'Value': TARGET_INSTANCE_TYPE}
        )

        # Start the instance
        logger.info(f"Starting instance {INSTANCE_ID}")
        ec2.start_instances(InstanceIds=[INSTANCE_ID])
        waiter = ec2.get_waiter('instance_running')
        waiter.wait(InstanceIds=[INSTANCE_ID])

        # Get new public IP
        response = ec2.describe_instances(InstanceIds=[INSTANCE_ID])
        public_ip = response['Reservations'][0]['Instances'][0].get('PublicIpAddress')

        logger.info(f"Instance {INSTANCE_ID} scaled up to {TARGET_INSTANCE_TYPE} and running. IP: {public_ip}")

        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': f'Instance {INSTANCE_ID} scaled up to {TARGET_INSTANCE_TYPE} and restarted.',
                'instance_id': INSTANCE_ID,
                'instance_type': TARGET_INSTANCE_TYPE,
                'public_ip': public_ip,
                'previous_type': current_type
            })
        }

    except Exception as e:
        logger.error(f"Error scaling instance: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': 'Failed to scale instance',
                'error': str(e)
            })
        }
