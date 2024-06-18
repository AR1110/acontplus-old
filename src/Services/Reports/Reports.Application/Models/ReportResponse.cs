namespace Reports.Application.Models
{
    public class ReportResponse
    {
        public byte[] FileContents { get; set; }
        public string ContentType { get; set; }
        public string FileDownloadName { get; set; }
    }
}
