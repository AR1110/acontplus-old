using Domain.Models.GestionFinanciera;

namespace Domain.ViewModels.GestionFinanciera
{
    public class MovimientoCajaViewModel
    {
        public MovimientoCaja movimiento { get; set; }
        public string nroDoc { get; set; }
        public string estado { get; set; }
        public string caja { get; set; }
        public string entidadFinanciera { get; set; }
        public string empleado { get; set; }


    }
}
