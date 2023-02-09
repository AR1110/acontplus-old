using Domain.Models.GestionFinanciera;

namespace Domain.ViewModels.GestionFinanciera
{
    public class PagoViewModel
    {
        public Pago pago { get; set; }
        public string subEntiadaFinanciera { get; set; }
        public string posfechado { get; set; }
        public string cobroEstado { get; set; }
        public string nroTransaccion { get; set; }
        public string banco { get; set; }
        public string cuentaBancaria { get; set; }
        public string tipoDocumento { get; set; }
        public string comprobante { get; set; }
    }
}
