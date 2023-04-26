namespace Domain.Admin.Models
{
    public class LicenciaPlan
    {
        public int idLicenciaPlan { get; set; }
        public int idLicencia { get; set; }
        public int idAplicacion { get; set; }
        public string codLicencia { get; set; }
        public string codAplicacion { get; set; }
        public decimal costo { get; set; }
        public decimal impuesto { get; set; }
        public decimal descuento { get; set; }
        public bool estado { get; set; }
    }
}