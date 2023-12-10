using Common.Core.Models.Compras;

namespace Common.Core.ViewModels.Compras
{
    public class NotaCreditoProveedorDetalleViewModel
    {
        public NotaCreditoProveedorDetalle detalle { get; set; }
        public string codigo { get; set; }
        public string nombreMedida { get; set; }
        public string nombreTipoIva { get; set; }
        public string codigoTipoIva { get; set; }
        public decimal ice { get; set; }
        public decimal porcentajeTipoIva { get; set; }
    }
}
