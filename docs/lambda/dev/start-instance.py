import boto3
import json
import logging
import http.client  # If you need the external API call

# Initialize logger for CloudWatch
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize AWS Client
region = 'us-east-2'
ec2 = boto3.client('ec2', region_name=region)

# Define CORS headers that will be used in every response.
# Using specific headers is better than a wildcard '*' for security.
CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'OPTIONS,POST'
}


def get_instance_public_ip(instance_id):
    """
    Safely retrieves the public IP address of a given EC2 instance.
    """
    try:
        response = ec2.describe_instances(InstanceIds=[instance_id])
        # Use .get() to avoid errors if the key doesn't exist
        ip_address = response['Reservations'][0]['Instances'][0].get(
            'PublicIpAddress')
        if not ip_address:
            logger.warning(
                f"Instance {instance_id} is running but has no public IP address.")
        return ip_address
    except Exception as e:
        logger.error(
            f"Could not describe instance {instance_id} to get IP: {e}")
        return None


def lambda_handler(event, context):
    """
    Handles API Gateway requests to start EC2 instances, waits for them to be
    running, and returns their public IP addresses.
    """
    # Correctly handle the browser's preflight CORS 'OPTIONS' request
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 204,
            'headers': CORS_HEADERS,
            'body': ''  # An empty body is standard for preflight responses
        }

    instances_to_start = ['i-0c4a1b416aa53319e']  # Your instance ID(s)

    try:
        # 1. Start the EC2 instances
        logger.info(
            f"Issuing start command for instances: {instances_to_start}")
        ec2.start_instances(InstanceIds=instances_to_start)

        # 2. Use a waiter to reliably wait until the instances are fully running
        waiter = ec2.get_waiter('instance_running')
        waiter.wait(InstanceIds=instances_to_start)
        logger.info(f"Instances {instances_to_start} are confirmed running.")

        # 3. Retrieve the public IP for each instance now that they are running
        public_ips = {}
        for instance_id in instances_to_start:
            public_ips[instance_id] = get_instance_public_ip(instance_id)

        logger.info(f"Successfully retrieved public IPs: {public_ips}")

        # 4. (Optional) Your original external API call logic
        # This part updates your external service, admin.acontplus.com
        url = 'admin.acontplus.com'
        conn = http.client.HTTPSConnection(url)
        headers = {'content-type': "application/json"}
        payload = [
            {
                "InstanceId": instance_id,
                "Enabled": "true",
                "IpAddress": public_ips.get(instance_id)
            } for instance_id in instances_to_start
        ]
        conn.request("PUT", "/api/Ec2Instance/PutExternal",
                     json.dumps(payload), headers)
        res = conn.getresponse()
        logger.info(f"External API Response Status: {res.status}")
        conn.close()

        # 5. Return a correctly formatted response for API Gateway
        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({
                'message': 'Instances started successfully',
                'instances_started': public_ips
            })
        }

    except Exception as e:
        logger.error(f"A critical error occurred: {e}")
        # Return a correctly formatted error response for API Gateway
        return {
            'statusCode': 500,
            'headers': CORS_HEADERS,
            'body': json.dumps({'message': 'Failed to start instances due to an internal error.'})
        }
