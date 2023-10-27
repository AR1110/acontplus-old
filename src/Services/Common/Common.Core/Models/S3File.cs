namespace Common.Core.Models
{
    public class S3File
    {
        public string BucketName { get; set; }
        public string Region { get; set; }
        public string S3ObjectKey { get; set; }
        public string S3ObjectUrl { get; set; }
    }
}
