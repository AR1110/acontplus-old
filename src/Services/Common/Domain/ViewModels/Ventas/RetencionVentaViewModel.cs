using Domain.Models.Ventas;

namespace Domain.ViewModels.Ventas
{
    public class RetencionVentaViewModel
    {
        public RetencionVenta retencion { get; set; }
        public List<RetencionVentaDetalle> detalle { get; set; }
        public string nroDoc { get; set; }
        public string nombreFiscal { get; set; }
        public decimal totalRenta { get; set; }
        public decimal totalIva { get; set; }
        public string nroIdentificacion { get; set; }
        public string nroFactura { get; set; }
    }

    public class RetencionVentaData
    {
        public RetencionVentaViewModel retencion { get; set; }
        public List<RetencionVentaDetalleViewModel> detalle { get; set; }
    }
}
