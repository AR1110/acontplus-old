namespace Domain.Models
{
    public class Reporte
    {
        public int idReporte { get; set; }
        public string codigo { get; set; }
        public string reportPath { get; set; }
        public string dataSource { get; set; }
        public string contentType { get; set; }
        public string storedProcedure { get; set; }
        public string nombreReporte { get; set; }
        public bool estado { get; set; }
    }
}
