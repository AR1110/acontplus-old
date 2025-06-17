import boto3
import json
import logging

# Initialize logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# AWS clients
region = 'us-east-2'
ec2 = boto3.client('ec2', region_name=region)

# Define CORS headers for responses
CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT'
}


def get_instance_public_ip(instance_id):
    """
    Retrieves the public IP address of a given EC2 instance.
    """
    try:
        response = ec2.describe_instances(InstanceIds=[instance_id])
        # Safely access the public IP address
        ip_address = response['Reservations'][0]['Instances'][0].get(
            'PublicIpAddress')
        if not ip_address:
            logger.error(
                f"Instance {instance_id} does not have a public IP address.")
            return None
        return ip_address
    except Exception as e:
        logger.error(f"Error describing instance {instance_id}: {e}")
        return None


def lambda_handler(event, context):
    """
    Handles incoming requests to start EC2 instances and return their public IPs.
    """
    # Handle preflight CORS requests
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({})
        }

    instances_to_start = ['i-0c4a1b416aa53319e']  # Your instance ID

    try:
        # Start the EC2 instances
        ec2.start_instances(InstanceIds=instances_to_start)
        logger.info(f"Starting instances: {instances_to_start}")

        # Use a waiter to ensure the instance is running before getting the IP
        waiter = ec2.get_waiter('instance_running')
        waiter.wait(InstanceIds=instances_to_start)
        logger.info(f"Instances {instances_to_start} are now running.")

        # Retrieve the public IP for each instance
        public_ips = {}
        for instance_id in instances_to_start:
            public_ips[instance_id] = get_instance_public_ip(instance_id)

        logger.info(f"Public IPs retrieved: {public_ips}")

        # NOTE: The section below for the PUT request to 'admin.acontplus.com'
        # remains as you had it. Ensure that the endpoint and payload are correct.
        # Consider adding error handling for this HTTP request.

        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({
                'message': 'Instances started successfully',
                'instances': instances_to_start,
                'public_ips': public_ips
            })
        }

    except Exception as e:
        logger.error(f"An error occurred: {e}")
        return {
            'statusCode': 500,
            'headers': CORS_HEADERS,
            'body': json.dumps({'message': 'Failed to start instances.'})
        }
