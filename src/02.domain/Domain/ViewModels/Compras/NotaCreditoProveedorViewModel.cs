using Domain.Models.Compras;

namespace Domain.ViewModels.Compras
{
    public class NotaCreditoProveedorViewModel
    {
        public NotaCreditoProveedor notaCredito { get; set; }
        public List<NotaCreditoProveedorDetalle> detalle { get; set; }
        public string nroDoc { get; set; }
        public string nombreFiscal { get; set; }
        public string nroIdentificacion { get; set; }
        public string factura { get; set; }
        public string correo { get; set; }
        public string usuario { get; set; }
        public string direccion { get; set; }
    }

    public class NotaCreditoProveedorData
    {
        public NotaCreditoProveedorViewModel notaCredito { get; set; }
        public List<NotaCreditoProveedorDetalleViewModel> detalle { get; set; }
    }
}
