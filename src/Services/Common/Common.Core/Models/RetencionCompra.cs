namespace Common.Core.Models
{
    public class RetencionCompra
    {
        public long idRetencionCompra { get; set; }
        public long idTipoDocumento { get; set; }
        public long idFacturaCompra { get; set; }
        public long idProveedor { get; set; }
        public int idPuntoEmision { get; set; }
        public int numeroRetencion { get; set; }
        public string autorizacionSri { get; set; }
        public string claveAcceso { get; set; }
        public string fechaEmision { get; set; }
        public decimal total { get; set; }
        public string fechaAutorizacionSri { get; set; }
        public string concepto { get; set; }
        public bool estado { get; set; }

    }
}
