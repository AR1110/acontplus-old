using Domain.Models.GestionTributaria;

namespace Domain.ViewModels.GestionTributaria
{
    public class RetencionRentaViewModel
    {
        public RetencionRenta retencionRenta { get; set; }
        public string tipoImpuestoRenta { get; set; }
        public int totalRecords { get; set; }
    }
}
