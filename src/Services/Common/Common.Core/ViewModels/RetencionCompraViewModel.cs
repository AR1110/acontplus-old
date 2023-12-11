using Common.Core.Models;
using Common.Core.Models.InfoAdicional;

namespace Common.Core.ViewModels
{
    public class RetencionCompraViewModel
    {
        public RetencionCompra retencionCompra { get; set; }
        public List<RetencionCompraDetalle> dataDetalle { get; set; }
        public List<InfoAdicionalDoc> adicional { get; set; }
        public string proveedor { get; set; }
        public string numeroIdentificacion { get; set; }
        public decimal retencion { get; set; }
        public string numeroDocumento { get; set; }
        public decimal totalIva { get; set; }
        public decimal totalRenta { get; set; }
        public string estadoSri { get; set; }
        public string nroFactura { get; set; }
        public bool gestion { get; set; }
        public string style { get; set; }
        public string usuario { get; set; }
    }

    public class RetencionCompraData
    {
        public RetencionCompraViewModel retencionCompra { get; set; }
        public List<RetencionCompraDetalleViewModel> dataDetalle { get; set; }
        public List<InfoAdicionalDoc> infoAdicional { get; set; }
    }

}
