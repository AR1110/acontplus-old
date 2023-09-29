
using Restaurant.Core.Entities;

namespace Restaurant.Core.Interfaces
{
    public interface IStorageService
    {
        Task<S3Response> UploadFileAsync(S3Object obj, AwsCredentials awsCredentialsValues);
    }
}
