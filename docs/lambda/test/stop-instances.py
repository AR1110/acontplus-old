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

# Define CORS headers that will be used in the response
# We will fix the wildcard issue in API Gateway directly
CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'OPTIONS,POST'
}


def lambda_handler(event, context):
    # This correctly handles the preflight OPTIONS request
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 204,
            'headers': CORS_HEADERS,
            'body': ''  # Empty body for OPTIONS response
        }

    instances_to_stop = ['i-0c4a1b416aa53319e',
                         'i-0450613a4f20fd941', 'i-0687be93dfa446532']

    try:
        # Stop the instances and wait for them to be stopped
        ec2.stop_instances(InstanceIds=instances_to_stop)
        waiter = ec2.get_waiter('instance_stopped')
        waiter.wait(InstanceIds=instances_to_stop)
        logger.info(
            f"Instances {instances_to_stop} are now confirmed stopped.")

        # Your external API call logic here...
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
        # *** THIS IS THE CORRECTED ERROR RESPONSE ***
        return {
            'statusCode': 500,
            'headers': CORS_HEADERS,
            'body': json.dumps({'message': 'An internal error occurred while stopping instances.'})
        }
