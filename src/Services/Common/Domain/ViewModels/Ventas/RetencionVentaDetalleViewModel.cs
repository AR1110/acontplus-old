using Domain.Models.Ventas;

namespace Domain.ViewModels.Ventas
{
    public class RetencionVentaDetalleViewModel
    {
        public RetencionVentaDetalle detalle { get; set; }
        public string codigoImpuesto { get; set; }
        public string tipoImpuesto { get; set; }
        public string impuesto { get; set; }
        public string fechaEmision { get; set; }
        public string nroDocumento { get; set; }
        public string icono { get; set; }
        public int codigoSri { get; set; }
    }
}
