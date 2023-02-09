using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Domain.Models.Reports
{
    public class DataReport
    {
        public string NombreImpresora { get; set; }
        public List<Stream> StreamsFile { get; set; }
    }
}
