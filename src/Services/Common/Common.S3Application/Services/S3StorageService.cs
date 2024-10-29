using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Common.Core.Models;
using Common.S3Application.Interfaces;

namespace Common.S3Application.Services;

public class S3StorageService : IS3StorageService
{
    public async Task<S3Response> UploadAsync(S3ObjectCustom s3ObjectCustom)
    {
        var credentials =
            new BasicAWSCredentials(s3ObjectCustom.AwsCredentials.Key, s3ObjectCustom.AwsCredentials.Secret);
        AWSConfigs.AWSRegion = s3ObjectCustom.Region;
        var response = new S3Response();
        try
        {
            using (var ms = new MemoryStream(s3ObjectCustom.Content))
            {
                var uploadRequest = new TransferUtilityUploadRequest
                {
                    InputStream = ms,
                    Key = s3ObjectCustom.S3ObjectKey,
                    BucketName = s3ObjectCustom.BucketName,
                    CannedACL = S3CannedACL.NoACL
                };
                using var client = new AmazonS3Client(credentials);
                var transferUtility = new TransferUtility(client);
                await transferUtility.UploadAsync(uploadRequest);
            }

            response.StatusCode = 201;
            response.Message = $"El archivo {s3ObjectCustom.S3ObjectKey} se actualizo correctamente en amazon s3";
        }
        catch (AmazonS3Exception s3Ex)
        {
            response.StatusCode = (int)s3Ex.StatusCode;
            response.Message = s3Ex.Message;
        }
        catch (Exception ex)
        {
            response.StatusCode = 500;
            response.Message = ex.Message;
        }

        return response;
    }

    public async Task<S3Response> UpdateAsync(S3ObjectCustom s3ObjectCustom)
    {
        var credentials =
            new BasicAWSCredentials(s3ObjectCustom.AwsCredentials.Key, s3ObjectCustom.AwsCredentials.Secret);
        AWSConfigs.AWSRegion = s3ObjectCustom.Region;
        var s3Response = new S3Response();
        try
        {
            using var client = new AmazonS3Client(credentials);
            using (var ms = new MemoryStream(s3ObjectCustom.Content))
            {
                var request = new PutObjectRequest
                {
                    BucketName = s3ObjectCustom.BucketName,
                    Key = s3ObjectCustom.S3ObjectKey,
                    InputStream = ms,
                    CannedACL = S3CannedACL.NoACL
                };
                var response = await client.PutObjectAsync(request);
            }

            s3Response.StatusCode = 201;
            s3Response.Message = $"El archivo {s3ObjectCustom.S3ObjectKey} se subio correctamente a amazon s3";
        }
        catch (AmazonS3Exception s3Ex)
        {
            s3Response.StatusCode = (int)s3Ex.StatusCode;
            s3Response.Message = s3Ex.Message;
        }
        catch (Exception ex)
        {
            s3Response.StatusCode = 500;
            s3Response.Message = ex.Message;
        }

        return s3Response;
    }

    public async Task<S3Response> DeleteAsync(S3ObjectCustom s3ObjectCustom)
    {
        var credentials =
            new BasicAWSCredentials(s3ObjectCustom.AwsCredentials.Key, s3ObjectCustom.AwsCredentials.Secret);
        AWSConfigs.AWSRegion = s3ObjectCustom.Region;
        var s3Response = new S3Response();
        try
        {
            using var client = new AmazonS3Client(credentials);
            var request = new DeleteObjectRequest
            {
                BucketName = s3ObjectCustom.BucketName, Key = s3ObjectCustom.S3ObjectKey
            };
            var response = await client.DeleteObjectAsync(request);
            s3Response.StatusCode = 201;
            s3Response.Message = $"El archivo {s3ObjectCustom.S3ObjectKey} se elimino correctamente de amazon s3";
        }
        catch (AmazonS3Exception s3Ex)
        {
            s3Response.StatusCode = (int)s3Ex.StatusCode;
            s3Response.Message = s3Ex.Message;
        }
        catch (Exception ex)
        {
            s3Response.StatusCode = 500;
            s3Response.Message = ex.Message;
        }

        return s3Response;
    }
}
