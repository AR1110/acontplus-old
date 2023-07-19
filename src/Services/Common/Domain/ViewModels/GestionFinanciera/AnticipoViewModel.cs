using Domain.Models.GestionFinanciera;

namespace Domain.ViewModels.GestionFinanciera
{
    public class AnticipoViewModel
    {
        public Anticipo anticipo { get; set; }
        public string cliente { get; set; }
        public string entidadFinanciera { get; set; }
        public string nroDoc { get; set; }


    }
}
