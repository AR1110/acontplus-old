using System;

namespace Domain.Dtos
{
    public class ReporteDto
    {
        public string reportPath { get; set; }
        public string dataSource { get; set; }
        public string storedProcedure { get; set; }
        public String json { get; set; }
        public byte[] imagen { get; set; }
        public string mimeType { get; set; } //para imagenes de logo
        public string format { get;set; }
        public string contentType { get; set; }
    }
}
