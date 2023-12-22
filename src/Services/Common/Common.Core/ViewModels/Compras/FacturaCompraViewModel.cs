using Common.Core.Models.Compras;

namespace Common.Core.ViewModels.Compras
{
    public class FacturaCompraViewModel
    {
        public FacturaCompra factura { get; set; }
        public List<FacturaCompraDetalle> detalle { get; set; }
        //   public List<ManejoArticuloDetalleViewModel> manejoArticuloDetalle { get; set; }
        public string artInfoAdicionales { get; set; }
        public string nroDocumento { get; set; }
        public string nombreFiscal { get; set; }
        public string nroRetencion { get; set; }
        public string estadoFinanciero { get; set; }
        public string nroIdentificacion { get; set; }
        public string direccion { get; set; }
        public string correo { get; set; }
        public string sucursal { get; set; }
        public decimal abono { get; set; }
        public decimal saldo { get; set; }
        public decimal posfechado { get; set; }
        public string usuario { get; set; }

    } 
     
}
