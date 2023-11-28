using Common.Core.Models;

namespace Common.Core.Interfaces
{
    public interface IS3StorageService
    {
        Task<S3Response> UploadAsync(S3ObjectCustom obj, AwsCredentials awsCredentialsValues);
        Task<S3Response> UpdateAsync(S3ObjectCustom obj, AwsCredentials awsCredentialsValues);
    }
}
