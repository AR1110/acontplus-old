using System;
using System.Collections.Generic;
using System.Data;

namespace HelpersNS20.Dtos
{
    public class ApiPrintRequestDto
    {
        public string printerName { get; set; }
        public Guid token { get; set; }
        public Dictionary<string, string> rdlcProps { get; set; }
        public Dictionary<string, List<Dictionary<string, string>>> dataSources { get; set; }
        public Dictionary<string, string> rdlcParams { get; set; }        

    }
}