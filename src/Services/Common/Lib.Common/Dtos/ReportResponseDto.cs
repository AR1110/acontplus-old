namespace Lib.Common.Dtos
{
    public class ReportResponseDto
    {
        public byte[] FileContents { get; set; }
        public string ContentType { get; set; }
        public string FileDownloadName { get; set; }
        public void Create(byte[] fileContents, string contentType, string fileDownloadName = null)
        {
            FileContents = fileContents;
            ContentType = contentType;
            FileDownloadName = fileDownloadName;
        }
    }
}
