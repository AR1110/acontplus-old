using Domain.Models.Tesoreria;

namespace Domain.ViewModels.Tesoreria
{
    public class CobroDetalleViewModel
    {
        public CobroDetalle cobroDetalle { get; set; }
        public int secuencial { get; set; }
        public string estadoPago { get; set; }
        public string nroCuota { get; set; }
        public decimal cuota { get; set; }
        public decimal mora { get; set; }
        public decimal saldo { get; set; }
        public decimal saldoAnterior { get; set; }
        public string fechaVencimiento { get; set; }
        public string nroDoc { get; set; }
        public string tipDoc { get; set; }
    }
}
