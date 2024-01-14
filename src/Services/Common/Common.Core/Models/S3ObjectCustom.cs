using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
namespace Common.Core.Models
{
    public sealed class S3ObjectCustom : IDisposable
    {
        private readonly IConfiguration _configuration;
        public S3ObjectCustom(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public string Region { get; set; }
        public string BucketName { get; set; } = null!;
        public byte[] Content { get; set; }
        public string S3ObjectKey { get; set; }
        public string S3ObjectUrl { get; set; }
        public AwsCredentials AwsCredentials { get; set; }
        public async Task Add(string filePath, IFormFile file, string s3ObjectKey = null, string s3ObjectUrl = null)
        {
            var fileExt = Path.GetExtension(file.FileName);
            this.BucketName = _configuration["S3Bucket:Name"];
            this.Region = _configuration["S3Bucket:Region"];
            this.S3ObjectKey = s3ObjectKey ?? $"{filePath}{Guid.NewGuid()}{fileExt}";
            this.S3ObjectUrl = s3ObjectUrl ?? $"https://{this.BucketName}.s3.{this.Region}.amazonaws.com/{this.S3ObjectKey}";
            using (var ms = new MemoryStream())
            {
                await file.CopyToAsync(ms);
                this.Content = ms.ToArray();
            }
            this.AwsCredentials = new AwsCredentials
            {
                Key = _configuration["AwsConfiguration:AWSAccessKey"],
                Secret = _configuration["AwsConfiguration:AWSSecretKey"]
            };
        }

        public void Add(string s3ObjectKey)
        {
            this.BucketName = _configuration["S3Bucket:Name"];
            this.Region = _configuration["S3Bucket:Region"];
            this.S3ObjectKey = s3ObjectKey; 
            this.AwsCredentials = new AwsCredentials
            {
                Key = _configuration["AwsConfiguration:AWSAccessKey"],
                Secret = _configuration["AwsConfiguration:AWSSecretKey"]
            };
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public void Dispose(bool disposing)
        {
            if (disposing)
            {
                BucketName = null;
                Region = null;
                S3ObjectKey = null;
                S3ObjectUrl = null;
                AwsCredentials = null;
            }
        }

        ~S3ObjectCustom()
        {
            Dispose(false);
        }
    }
}
