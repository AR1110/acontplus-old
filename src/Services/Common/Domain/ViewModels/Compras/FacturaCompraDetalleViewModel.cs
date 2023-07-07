using Domain.Models.Compras;

namespace Domain.ViewModels.Compras
{
    public class FacturaCompraDetalleViewModel
    {
        public FacturaCompraDetalle detalle { get; set; }
        public string codigo { get; set; }
        public bool datosAdicionales { get; set; }
        public bool llevaInventario { get; set; }
        public string nombreMedida { get; set; }
        public string nombreTipoIva { get; set; }
        public string codigoTipoIva { get; set; }
        public decimal ice { get; set; }

    }
}
