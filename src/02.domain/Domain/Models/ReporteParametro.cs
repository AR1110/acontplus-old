namespace Domain.Models
{
    public class ReporteParametro
    {
        public int idReporte { get; set; }
        public string reportPath { get; set; }
        public string format { get; set; }
        public string fileName { get; set; }
        public string storedProcedure { get; set; }
        public bool estado { get; set; }
    }
}