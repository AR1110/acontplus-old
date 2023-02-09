namespace Domain.Models
{
    public class ReporteParametroDataSource
    {
        public int idRPDS { get; set; }
        public int idReporteParametro { get; set; }
        public int position { get; set; }
        public string dataSource { get; set; }
        public bool estado { get; set; }
    }
}