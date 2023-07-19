namespace Domain.Models.Ventas
{
    public class Proforma
    {
        public long idProforma { get; set; }
        public long idTipoDocumento { get; set; }
        public long idCliente { get; set; }
        public long idPuntoEmision { get; set; }
        public int idUsuario { get; set; }
        public long nroDocumento { get; set; }
        public string fechaEmision { get; set; }
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
        public string identificacionComprador { get; set; }
        public string razonSocialComprador { get; set; }
        public string direccionComprador { get; set; }
        public string email { get; set; }
        public string telefono { get; set; }
    }
}
