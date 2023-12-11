using Common.Core.Models;

namespace Common.Core.ViewModels
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
