using Common.Core.Models.Compras;
using Common.Core.Models.InfoAdicional;

namespace Common.Core.ViewModels.Compras
{
    public class LiquidacionCompraViewModel
    {
        public LiquidacionCompra liquidacion { get; set; }
        public List<LiquidacionCompraDetalle> detalle { get; set; }
        public List<InfoAdicionalDoc> adicional { get; set; }
        public string nroDocumento { get; set; }
        public string nombreFiscal { get; set; }
        public string estadoFinanciero { get; set; }
        public string nroIdentificacion { get; set; }
        public string correo { get; set; }
        public string direccion { get; set; }
        public string estadoSri { get; set; }
        public bool gestion { get; set; }
        public string style { get; set; }
        public string usuario { get; set; }
    }

    public class LiquidacionCompraData
    {
        public LiquidacionCompraViewModel liquidacion { get; set; }
        public List<LiquidacionCompraDetalleViewModel> detalle { get; set; }
        public List<InfoAdicionalDoc> infoAdicional { get; set; }
    }
}
