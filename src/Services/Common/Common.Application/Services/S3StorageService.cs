using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Common.Core.Interfaces;
using Common.Core.Models;

namespace Common.Application.Services
{
    public class S3StorageService : IS3StorageService
    {
        public async Task<S3Response> UploadAsync(S3ObjectCustom obj, AwsCredentials awsCredentials)
        {
            var credentials = new BasicAWSCredentials(awsCredentials.Key, awsCredentials.Secret);
            AWSConfigs.AWSRegion = obj.Region;
            var _response = new S3Response();
            try
            {
                var uploadRequest = new TransferUtilityUploadRequest()
                {

                    InputStream = obj.InputStream,
                    Key = obj.Name,
                    BucketName = obj.BucketName,
                    CannedACL = S3CannedACL.NoACL
                };
                using var client = new AmazonS3Client(credentials);
                var transferUtility = new TransferUtility(client);
                await transferUtility.UploadAsync(uploadRequest);

                _response.StatusCode = 201;
                _response.Message = $"El archivo {obj.Name} se subio correctamente a amazon s3";
            }
            catch (AmazonS3Exception s3Ex)
            {
                _response.StatusCode = (int)s3Ex.StatusCode;
                _response.Message = s3Ex.Message;
            }
            catch (Exception ex)
            {
                _response.StatusCode = 500;
                _response.Message = ex.Message;
            }
            return _response;
        }
        public async Task<S3Response> UpdateAsync(S3ObjectCustom obj, AwsCredentials awsCredentials)
        {
            var credentials = new BasicAWSCredentials(awsCredentials.Key, awsCredentials.Secret);
            AWSConfigs.AWSRegion = obj.Region;
            var _response = new S3Response();
            try
            {
                using var client = new AmazonS3Client(credentials);
                // Create a PutObject request
                PutObjectRequest request = new PutObjectRequest
                {
                    BucketName = obj.BucketName,
                    Key = obj.Name,
                    InputStream = obj.InputStream,
                    CannedACL = S3CannedACL.NoACL
                };

                // Put object
                PutObjectResponse response = await client.PutObjectAsync(request);
                _response.StatusCode = 201;
                _response.Message = $"El archivo {obj.Name} se subio correctamente a amazon s3";
            }
            catch (AmazonS3Exception s3Ex)
            {
                _response.StatusCode = (int)s3Ex.StatusCode;
                _response.Message = s3Ex.Message;
            }
            catch (Exception ex)
            {
                _response.StatusCode = 500;
                _response.Message = ex.Message;
            }
            return _response;
        }
    }
}
