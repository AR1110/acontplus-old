namespace Domain.Models.ConfigEmpresa
{
    public class ConfigVentaDetalle
    {
        public long idConfigVentaDetalle { get; set; }
        public long idEntidad { get; set; }
        public bool porcentajeIva { get; set; }
        public bool porcentajeDescuento { get; set; }
        public bool descuento { get; set; }
        public bool totalDescuento { get; set; }
        public bool ice { get; set; }
    }
}
