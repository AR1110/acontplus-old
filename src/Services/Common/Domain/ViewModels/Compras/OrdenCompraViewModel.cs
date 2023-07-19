using Domain.Models.Compras;

namespace Domain.ViewModels.Compras
{
    public class OrdenCompraViewModel
    {
        public OrdenCompra ordenCompra { get; set; }
        public List<OrdenCompraDetalle> detalle { get; set; }
        public string nroDocumento { get; set; }
        public string nombreFiscal { get; set; }
        public string nroIdentificacion { get; set; }
        public string correo { get; set; }
        public string direccion { get; set; }
        public string usuario { get; set; }
    }

    public class OrdenCompraData
    {
        public OrdenCompraViewModel ordenCompra { get; set; }
        public List<OrdenCompraDetalleViewModel> detalle { get; set; }
    }
}
