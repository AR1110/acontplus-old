using Domain.Models;

namespace Domain.ViewModels
{
    public class TiempoCreditoViewModel
    {
        public TiempoCredito tiempoCredito { get; set; }
        public string nombreGestion { get; set; }
        public string nombreEntrada { get; set; }
        public string tipoCredito { get; set; }
        public int totalRecords { get; set; }
    }
}
