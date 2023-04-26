using Domain.Models.Inventario;

namespace Domain.ViewModels.Inventario
{
    public class ConsolidacionInventarioDetalleViewModel
    {
        public ConsolidacionInventarioDetalle detalle { get; set; }
        public string codigo { get; set; }
        public string nombreMedida { get; set; }
        public string nombreTipoIva { get; set; }
        public string codigoTipoIva { get; set; }
        public decimal ice { get; set; }
        public decimal stock { get; set; }
    }
}
