using Common.Core.Models.GestionTributaria;

namespace Common.Core.ViewModels.GestionTributaria
{
    public class ImpuestoArticuloViewModel
    {
        public ImpuestoArticulo impuestoArticulo { get; set; }
        public string subContribuyente { get; set; }
        public string nombreRetencionRenta { get; set; }
        public long idTipoImpuestoRenta { get; set; }
        public string nombreTipoRenta { get; set; }
        public long idTipoContribuyente { get; set; }
        public string nombreTipoContribuyente { get; set; }
    }
}
