namespace Domain.ViewModels.Ventas
{
    public class FacturaSearchViewModel
    {
        public bool byState { get; set; }
        public bool byDate { get; set; }
        public bool byClient { get; set; }
        public int idPuntoEmision { get; set; }
        public int idEstadoPago { get; set; }
        public DateTime? fechaInicio { get; set; }
        public DateTime? fechaFin { get; set; }
        public string client { get; set; }
        public int pageIndex { get; set; }
        public int pageSize { get; set; }
    }
}
