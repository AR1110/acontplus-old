using Domain.Models.GestionFinanciera;

namespace Domain.ViewModels.GestionFinanciera
{
    public class PagoDetalleViewModel
    {
        public PagoDetalle detalle { get; set; }
        public int secuencial { get; set; }
        public string estadoPago { get; set; }
        public string nroCuota { get; set; }
        public decimal cuota { get; set; }
        public decimal saldoAnterior { get; set; }
        public decimal saldo { get; set; }
        public string fechaVencimiento { get; set; }
    }
}
