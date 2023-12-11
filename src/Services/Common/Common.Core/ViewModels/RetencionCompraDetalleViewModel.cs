using Common.Core.Models;

namespace Common.Core.ViewModels
{
    public class RetencionCompraDetalleViewModel
    {
        public RetencionCompraDetalle retencionCompraDetalle { get; set; }
        public string codigoImpuesto { get; set; }
        public string tipoRetencion { get; set; }
        public string impuesto { get; set; }
        public string fechaEmision { get; set; }
        public string nroDocumento { get; set; }
        public string icono { get; set; }
        public int codigoRetencion { get; set; }
    }
}
