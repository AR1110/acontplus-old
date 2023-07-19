using Domain.Models.CuotaDocumento;

namespace Domain.ViewModels.CuotaDocumento
{
    public class CuotaXPagarViewModel
    {
        public CuotaXPagar cxp { get; set; }
        public decimal abono { get; set; }
        public decimal saldo { get; set; }
        public decimal abonoPosfechado { get; set; }
        public decimal xEfectivizar { get; set; }
        public string diasMoraView { get; set; }
        public decimal totalMasInteres { get; set; }
        public string estadoFinanciero { get; set; }
        public string nroCuota { get; set; }
        public string codigoFinanciero { get; set; }
        public int idTiempoCredito { get; set; }
        public string fechaEmision { get; set; }
        public decimal total { get; set; }
    }
}
