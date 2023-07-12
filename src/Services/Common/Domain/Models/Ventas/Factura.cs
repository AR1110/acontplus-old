namespace Domain.Models
{
    public class Factura
    {
        public long idFactura { get; set; }
        public long idCliente { get; set; }
        public long idSucursal { get; set; }
        public int idPuntoEmision { get; set; }
        public long idTipoDocumento { get; set; }
        public int idTiempoCredito { get; set; }
        public int idNotaEntrega { get; set; }
        public int nroFactura { get; set; }
        public string fechaEmision { get; set; }
        public string fechaVencimiento { get; set; }
        public string nroAutorizacion { get; set; }
        public string claveAcceso { get; set; }
        public string fechaAutorizacion { get; set; }
        public string emision { get; set; }
        public string placa { get; set; }
        public decimal subTotalSinImpuestos { get; set; }
        public decimal subTotalIva { get; set; }
        public decimal subTotalNetoIva { get; set; }
        public decimal subTotalIvaCero { get; set; }
        public decimal subTotalNetoIvaCero { get; set; }
        public decimal subTotalNoObjetoIva { get; set; }
        public decimal subTotalNetoNoObjetoIva { get; set; }
        public decimal subTotalExentoIva { get; set; }
        public decimal subTotalNetoExentoIva { get; set; }
        public decimal totalDescuento { get; set; }
        public decimal porcentajeDescuento { get; set; }
        public decimal totalIce { get; set; }
        public decimal irbpnr { get; set; }
        public decimal propina { get; set; }
        public decimal iva { get; set; }
        public decimal recargo { get; set; }
        public decimal transporte { get; set; }
        public decimal total { get; set; }
        public string observacion { get; set; }
        public bool retencion { get; set; }
        public bool guiaRemision { get; set; }
        public bool autorizada { get; set; }
        public bool anuladaSri { get; set; }
        public bool estado { get; set; }
    }
}
