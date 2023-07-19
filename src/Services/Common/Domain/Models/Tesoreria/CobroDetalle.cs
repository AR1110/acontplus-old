namespace Domain.Models.Tesoreria
{
    public class CobroDetalle
    {
        public long idCobroDetalle { get; set; }
        public long idCobro { get; set; }
        public long idCuotaXCobrar { get; set; }
        public decimal abono { get; set; }

    }
}
