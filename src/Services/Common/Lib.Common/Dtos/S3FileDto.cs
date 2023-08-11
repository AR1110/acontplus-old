namespace Lib.Common.Dtos
{
    public class S3FileDto
    {
        public string BucketName { get; set; }
        public string Region { get; set; }
        public string S3ObjectKey { get; set; }
        public string S3ObjectUrl { get; set; }
    }
}
