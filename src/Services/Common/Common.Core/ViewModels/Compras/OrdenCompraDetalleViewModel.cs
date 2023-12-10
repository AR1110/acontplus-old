using Common.Core.Models.Compras;

namespace Common.Core.ViewModels.Compras
{
    public class OrdenCompraDetalleViewModel
    {
        public OrdenCompraDetalle detalle { get; set; }
        public string codigo { get; set; }
        public bool llevaInventario { get; set; }
        public string nombreMedida { get; set; }
        public string nombreTipoIva { get; set; }
        public string codigoTipoIva { get; set; }
        public decimal ice { get; set; }

    }
}
