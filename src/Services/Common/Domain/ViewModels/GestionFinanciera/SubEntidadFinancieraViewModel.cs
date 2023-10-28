using Domain.Models.Tesoreria;

namespace Domain.ViewModels.GestionFinanciera
{
    public class SubEntidadFinancieraViewModel
    {
        public SubEntidadFinanciera subEntidadFinanciera { get; set; }
        public string entidadFinanciera { get; set; }
        public int totalRecords { get; set; }

    }
}
