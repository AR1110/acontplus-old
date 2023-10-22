using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Transfer;
using Restaurant.Core.Entities;
using Restaurant.Core.Interfaces;

namespace Restaurant.Application.Services
{
    public class StorageService : IStorageService
    {
        public StorageService() { }



        public async Task<S3Response> UploadFileAsync(S3Object obj, AwsCredentials awsCredentials)

        {

            var credentials = new BasicAWSCredentials(awsCredentials.Key, awsCredentials.Secret);

            var config = new AmazonS3Config()

            {

                RegionEndpoint = Amazon.RegionEndpoint.USEast2

            };

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

                using var client = new AmazonS3Client(credentials, config);

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
    }
}
