import boto3
import http.client
import json
import logging

# Initialize logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# AWS client
region = 'us-east-2'
ec2 = boto3.client('ec2', region_name=region)

# Define CORS headers for all responses
CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT'
}


def lambda_handler(event, context):
    """
    Handles incoming requests to stop EC2 instances.
    """
    # Handle preflight CORS requests from the browser
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({})
        }

    instances_to_stop = ['i-0c4a1b416aa53319e',
                         'i-0450613a4f20fd941', 'i-0687be93dfa446532']

    try:
        # Initiate the stopping of instances
        ec2.stop_instances(InstanceIds=instances_to_stop)
        logger.info(f"Stop command issued for instances: {instances_to_stop}")

        # Use a waiter to wait until the instances are fully stopped
        waiter = ec2.get_waiter('instance_stopped')
        waiter.wait(InstanceIds=instances_to_stop)
        logger.info(
            f"Instances {instances_to_stop} are now confirmed stopped.")

        # Dynamically create the payload for the external API call
        payload = [
            {"InstanceId": instance_id, "Enabled": "false"}
            for instance_id in instances_to_stop
        ]

        # Make the PUT request to your external service
        # NOTE: Consider adding specific error handling for this network call
        url = 'admin.acontplus.com'
        conn = http.client.HTTPSConnection(url)
        headers = {'content-type': "application/json"}
        conn.request("PUT", "/api/Ec2Instance/PutExternal",
                     json.dumps(payload), headers)

        response = conn.getresponse()
        response_data = response.read().decode()
        logger.info(f"External API response status: {response.status}")
        logger.info(f"External API response data: {response_data}")
        conn.close()

        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({
                'message': 'Instances stopped successfully',
                'instances': instances_to_stop
            })
        }

    except Exception as e:
        logger.error(f"An error occurred: {e}")
        return {
            'statusCode': 500,
            'headers': CORS_HEADERS,
            'body': json.dumps({'message': 'Failed to stop instances.'})
        }
