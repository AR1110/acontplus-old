using Domain.Models;

namespace Domain.ViewModels
{
    public class RetencionInfoAdicionalViewModel
    {
        public RetencionInfoAdicional retencionInfoAdicional { get; set; }
        public List<RetencionCompraDetalleViewModel> dataDetalle { get; set; }
    }
}
