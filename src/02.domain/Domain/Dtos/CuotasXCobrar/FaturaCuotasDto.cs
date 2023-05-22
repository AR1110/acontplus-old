namespace Domain.Dtos.CuotasXCobrar
{
    public class FaturaCuotasDto
    {
        public long idFacturaCxC { get; set; }
        public string fechaVencimiento { get; set; }
        public string nroCuota { get; set; }
        public decimal cuota { get; set; }
        public decimal abono { get; set; }
        public decimal saldo { get; set; }
        public string posfechado { get; set; }
        public decimal abonoPosfechado { get; set; }
        public decimal xEfectivizar { get; set; }
        public string diasMora { get; set; }
        public decimal interes { get; set; }
        public decimal totalMasInteres { get; set; }
        public string estadoFinanciero { get; set; }

    }
}
