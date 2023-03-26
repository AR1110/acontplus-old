namespace PrintServer.Models
{
    public class ApiPrintRequest
    {
        public List<Dictionary<string, string>> rdlcProps { get; set; }
        public Dictionary<string, List<Dictionary<string, string>>> dataSources { get; set; }
        public Dictionary<string, string> rdlcParams { get; set; }
    }
}