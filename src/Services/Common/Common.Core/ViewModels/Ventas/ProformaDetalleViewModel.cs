using Common.Core.Models.Ventas;

namespace Common.Core.ViewModels.Ventas
{
    public class ProformaDetalleViewModel
    {
        public ProformaDetalle detalle { get; set; }
        public string codigo { get; set; }
        public string nombreMedida { get; set; }
        public string nombreTipoIva { get; set; }
        public string codigoTipoIva { get; set; }
        public string presentacion { get; set; }
        public decimal porcentajeTipoIva { get; set; }
    }
}
