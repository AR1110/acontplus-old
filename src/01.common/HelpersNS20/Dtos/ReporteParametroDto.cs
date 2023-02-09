using System;

namespace HelpersNS20.Dtos
{
    public class ReporteParametroDto
    {
        public string reportPath { get; set; }
        public string dataSource { get; set; }
        public string storedProcedure { get; set; }
        public String json { get; set; }
        public byte[] imagen { get; set; }
        public string mimeType { get; set; } //para imagenes de logo
        public string format { get; set; }
        public string contentType { get; set; }
        public string fileName { get; set; }
    }
}
