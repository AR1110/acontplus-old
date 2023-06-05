namespace Domain.Models
{
    public class NotaEntrega
    {
        public long idNotaEntrega { get; set; }
        public string uniqueId { get; set; } //cuando es aprobacion documento 
        public int idCliente { get; set; }
        public string codEstab { get; set; }
        public int idPuntoEmision { get; set; }
        public int idTipoDocumento { get; set; }
        public int idUsuario { get; set; }
        public int idTiempoCredito { get; set; }
        public long nroFactura { get; set; }
        public string fechaEmision { get; set; }
        public string fechaVencimiento { get; set; }
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
        public decimal tarifa { get; set; }
        public string observacion { get; set; }
        public bool estado { get; set; }
    }
}
