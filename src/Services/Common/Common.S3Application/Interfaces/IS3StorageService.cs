using Common.Core.Models;

namespace Common.S3Application.Interfaces;

public interface IS3StorageService
{
    Task<S3Response> UploadAsync(S3ObjectCustom s3ObjectCustom);
    Task<S3Response> UpdateAsync(S3ObjectCustom s3ObjectCustom);
    Task<S3Response> DeleteAsync(S3ObjectCustom s3ObjectCustom);
}
