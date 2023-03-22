namespace Domain.Models
{
    public class ApiReportParams
    {
        public bool isReportDynamic { get; set; }
        public int idRol { get; set; }
        public bool hasService { get; set; }
        public string reportParams { get; set; }
        public string dataParams { get; set; }
        public bool sendEmail { get; set; }
        public Dictionary<string, string> parameters { get; set; }
    }
}
