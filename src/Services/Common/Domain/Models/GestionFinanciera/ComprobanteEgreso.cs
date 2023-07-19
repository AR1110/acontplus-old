namespace Domain.Models.GestionFinanciera
{
    public class ComprobanteEgreso
    {
        public long idComprobanteEgreso { get; set; }
        public int idProveedor { get; set; }
        public string codEstab { get; set; }
        public long idCaja { get; set; }
        public long nroDocumento { get; set; }
        public decimal total { get; set; }
        public bool estado { get; set; }
        public string fechaRegistro { get; set; }
    }
}
