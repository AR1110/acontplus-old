namespace Common.Core.Interfaces;

public interface IS3StorageService
{
    Task<S3Response> UploadAsync(S3ObjectCustom obj);
    Task<S3Response> UpdateAsync(S3ObjectCustom obj);
    Task<S3Response> DeleteAsync(S3ObjectCustom obj);
}
