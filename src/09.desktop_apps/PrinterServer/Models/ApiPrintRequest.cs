using System.Collections.Generic;

namespace PrinterServer.Models
{
    public class ApiPrintRequest
    {
        public Dictionary<string, string> rdlcProps { get; set; }
        public Dictionary<string, List<Dictionary<string, string>>> dataSources { get; set; }
        public Dictionary<string, string> rdlcParams { get; set; }
    }
}