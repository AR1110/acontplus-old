using Common.Core.Models;

namespace Common.Core.Interfaces
{
    public interface IStorageService
    {
        Task<S3Response> UploadFileAsync(S3Object obj, AwsCredentials awsCredentialsValues);
    }
}
