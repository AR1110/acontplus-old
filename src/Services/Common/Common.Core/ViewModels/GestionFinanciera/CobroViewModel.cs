using Common.Core.Models.Tesoreria;

namespace Common.Core.ViewModels.GestionFinanciera
{
    public class CobroViewModel
    {
        public Cobro cobro { get; set; }
        public string tipoCheque { get; set; }
        public string posfechado { get; set; }
        public string cobroEstado { get; set; }
        public string nroTransaccion { get; set; }
        public string banco { get; set; }
        public string cuentaBancaria { get; set; }
        public string tipoDocumento { get; set; }
        public string comprobante { get; set; }
        public string estado { get; set; }
        public string color { get; set; }
        public string subEntiadaFinanciera { get; set; }
    }
}
