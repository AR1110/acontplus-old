using Domain.Models.Compras;

namespace Domain.ViewModels.Compras
{
    public class FacturaCompraViewModel
    {
        public FacturaCompra factura { get; set; }
        public List<FacturaCompraDetalle> detalle { get; set; }
        public List<ManejoArticuloDetalleViewModel> manejoArticuloDetalle { get; set; }
        public string datosAdiciones { get; set; }  
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

    public class FacturaCompraData
    {
        public FacturaCompraViewModel facturaCompra { get; set; }
        public List<FacturaCompraDetalleViewModel> detalle { get; set; }
        public List<ManejoArticuloDetalleViewModel> adicional { get; set; }
    }

    public class FacturaCompraSearch
    {
        public int byProveedor { get; set; }
        public int byEstado { get; set; }
        public string fechaEmision { get; set; }
        public string fechaFin { get; set; }
        public string fechaVencimiento { get; set; }
        public int bySucursal { get; set; }
    }
}
