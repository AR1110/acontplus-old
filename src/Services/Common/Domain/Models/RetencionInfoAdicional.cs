namespace Domain.Models
{
    public class RetencionInfoAdicional
    {
        public int idRetencionInfoAdicional { get; set; }
        public int idRetencionCompra { get; set; }
        public string puntoEmision { get; set; }
        public int numeroFactura { get; set; }
        public string fechaEmision { get; set; }
    }
}
