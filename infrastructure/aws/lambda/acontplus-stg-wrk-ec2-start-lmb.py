"""
Lambda Function: acontplus-stg-wrk-ec2-start-lmb
Description: Starts EC2 instances in the staging environment
VPC: vpc-06138fbf0eb6b9820 (acontplus-stg-vpc)
Naming Convention: {prefix}-{env}-{app-type}-{service-name}-{aws-service}
Created: 2026-02-01
"""
import boto3
import http.client
import json
import logging

# Config
region = 'us-east-1'
VPC_ID = 'vpc-06138fbf0eb6b9820'  # acontplus-stg-vpc

# EC2 instances in vpc-06138fbf0eb6b9820 (acontplus-stg-vpc)
instances = [
    'i-0062da774c359130d',  # acontplus-stg-db-ec2-01
    'i-0babc4241fc457a3d',  # acontplus-stg-reports-ec2-01
]
external_api_url = 'admin.acontplus.com'
external_api_path = '/api/Ec2Instance/PutExternal'

# CORS headers for staging
CORS_HEADERS = {
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Requested-With',
    'Access-Control-Allow-Origin': 'https://admin.acontplus.com',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    'Access-Control-Max-Age': '30',
}

# Logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)

ec2 = boto3.client('ec2', region_name=region)

def get_instance_public_ip(instance_id):
    try:
        response = ec2.describe_instances(InstanceIds=[instance_id])
        return response['Reservations'][0]['Instances'][0].get('PublicIpAddress')
    except Exception as e:
        logger.error(f"Error getting public IP for {instance_id}: {e}")
        return None

def lambda_handler(event, context):
    http_method = event.get('httpMethod', '')

    if http_method == 'OPTIONS':
        return {
            'statusCode': 204,
            'headers': CORS_HEADERS,
            'body': ''
        }

    external_api_status = None
    external_api_error = None
    public_ips = {}

    try:
        # Start instances
        logger.info(f"Starting instances: {instances}")
        ec2.start_instances(InstanceIds=instances)

        # Wait for instances to be running
        waiter = ec2.get_waiter('instance_running')
        waiter.wait(InstanceIds=instances)
        logger.info(f"Instances are running: {instances}")

        # Retrieve public IPs
        for instance_id in instances:
            public_ips[instance_id] = get_instance_public_ip(instance_id)
        logger.info(f"Public IPs: {public_ips}")

        # Call external API
        try:
            conn = http.client.HTTPSConnection(external_api_url)
            headers = {'content-type': "application/json"}
            payload = [
                {
                    "instanceId": instance_id,
                    "enabled": "true",
                    "ipAddress": public_ips[instance_id]
                } for instance_id in instances
            ]
            # Ensure the body is sent as bytes for compatibility
            conn.request("PUT", external_api_path, json.dumps(payload).encode("utf-8"), headers)
            res = conn.getresponse()
            external_api_status = res.status
            external_api_body = res.read().decode()
            logger.info(f"External API Response Status: {external_api_status}, Body: {external_api_body}")
            conn.close()
        except Exception as ext_api_err:
            logger.error(f"Error calling external API: {ext_api_err}")
            external_api_error = str(ext_api_err)
            external_api_status = None

        response_body = {
            'message': 'Started instances successfully',
            'instances': instances,
            'public_ips': public_ips,
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
            'body': json.dumps({'message': 'Failed to start instances due to an internal error.', 'error': str(e)})
        }
