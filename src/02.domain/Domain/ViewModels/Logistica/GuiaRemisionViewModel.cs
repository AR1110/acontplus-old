using Domain.Models.InfoAdicional;
using Domain.Models.Logistica;

namespace Domain.ViewModels.Logistica
{
    public class GuiaRemisionViewModel
    {
        public GuiaRemision guia { get; set; }
        public List<GuiaRemisionDetalle> detalle { get; set; }
        public List<InfoAdicionalDoc> adicional { get; set; }
        public string nroDocumento { get; set; }
        public string cliente { get; set; }
        public string factura { get; set; }
        public string transportista { get; set; }
        public bool gestion { get; set; }
        public string estadoSri { get; set; }
        public string style { get; set; }

    }

    public class GuiaRemisionData
    {
        public GuiaRemisionViewModel guia { get; set; }
        public List<GuiaRemisionDetalleViewModel> detalle { get; set; }
        public List<InfoAdicionalDoc> infoAdicional { get; set; }

    }
}
