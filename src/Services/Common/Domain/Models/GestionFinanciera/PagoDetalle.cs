namespace Domain.Models.GestionFinanciera
{
    public class PagoDetalle
    {
        public long idPagoDetalle { get; set; }
        public long idPago { get; set; }
        public long idCuotaXPagar { get; set; }
        public decimal abono { get; set; }
    }
}
