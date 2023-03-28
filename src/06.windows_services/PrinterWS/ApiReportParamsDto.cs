using System;
using System.Collections.Generic;

namespace PrinterWS
{
    public class ApiReportParamsDto
    {
        public Guid token { get; set; }
        public int idRol { get; set; }
        public bool hasService { get; set; }
        public string reportParams { get; set; }
        public string dataParams { get; set; }
        public string claveAcceso { get; set; }        
        public Dictionary<string, string> rdlcProps { get; set; }
        public Dictionary<string, List<Dictionary<string, string>>> dataSources { get; set; }
        public Dictionary<string, string> rdlcParams { get; set; }
    }
}
