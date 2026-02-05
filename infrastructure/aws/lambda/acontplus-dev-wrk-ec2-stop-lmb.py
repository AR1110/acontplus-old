"""
Lambda Function: acontplus-dev-wrk-ec2-stop-lmb
Description: Stops EC2 instances in the development environment
VPC: vpc-0ac480897a4843766 (acontplus-dev-vpc)
Naming Convention: {prefix}-{env}-{app-type}-{service-name}-{aws-service}
Created: 2026-02-01
"""
import boto3
import json
import logging
import http.client

# Initialize logger for CloudWatch
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize AWS Client
region = 'us-east-1'
ec2 = boto3.client('ec2', region_name=region)

# VPC Configuration
VPC_ID = 'vpc-0ac480897a4843766'  # acontplus-dev-vpc

# Define CORS headers that will be used in every response.
CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'OPTIONS,POST'
}


def lambda_handler(event, context):
    """
    Handles API Gateway requests to stop EC2 instances, waits for them to be
    stopped, and updates admin.acontplus.com.
    """
    # Correctly handle the browser's preflight CORS 'OPTIONS' request
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 204,
            'headers': CORS_HEADERS,
            'body': ''
        }

    # EC2 instances in vpc-0ac480897a4843766 (acontplus-dev-vpc)
    instances_to_stop = ['i-06deac55680284806']  # acontplus-dev-ec2-01
    external_api_status = None
    external_api_error = None

    try:
        # 1. Stop the EC2 instances
        logger.info(f"Issuing stop command for instances: {instances_to_stop}")
        ec2.stop_instances(InstanceIds=instances_to_stop)

        # 2. Use a waiter to reliably wait until the instances are fully stopped
        waiter = ec2.get_waiter('instance_stopped')
        waiter.wait(InstanceIds=instances_to_stop)
        logger.info(f"Instances {instances_to_stop} are confirmed stopped.")

        # 3. Update external API to mark instances as disabled
        url = 'admin.acontplus.com'
        try:
            conn = http.client.HTTPSConnection(url)
            headers = {'content-type': "application/json"}
            payload = [
                {
                    "instanceId": instance_id,
                    "enabled": "false",
                    "ipAddress": None
                } for instance_id in instances_to_stop
            ]
            conn.request("PUT", "/api/Ec2Instance/PutExternal",
                         json.dumps(payload).encode("utf-8"), headers)
            res = conn.getresponse()
            external_api_status = res.status
            external_api_body = res.read().decode()
            logger.info(f"External API Response Status: {external_api_status}, Body: {external_api_body}")
            conn.close()
        except Exception as ext_api_err:
            logger.error(f"Error calling external API: {ext_api_err}")
            external_api_error = str(ext_api_err)
            external_api_status = None

        # 4. Return a correctly formatted response for API Gateway
        response_body = {
            'message': 'Instances stopped successfully',
            'instances_stopped': instances_to_stop,
            'external_api_status': external_api_status,
        }
        if external_api_error:
            response_body['external_api_error'] = external_api_error
        return {
            'statusCode': 200 if not external_api_error else 207,
            'headers': CORS_HEADERS,
            'body': json.dumps(response_body)
        }

    except Exception as e:
        logger.error(f"A critical error occurred: {e}")
        return {
            'statusCode': 500,
            'headers': CORS_HEADERS,
            'body': json.dumps({'message': 'Failed to stop instances due to an internal error.', 'error': str(e)})
        }
