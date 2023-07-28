using Inventario.Core.Models;
using Lib.Common.Api;

namespace Inventario.Core.Interfaces
{
    public interface IStorageService
    {
        Task<S3Response> UploadFileAsync(S3Object obj, AwsCredentials awsCredentialsValues);
    }
}
