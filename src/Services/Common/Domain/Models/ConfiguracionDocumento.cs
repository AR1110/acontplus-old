namespace Domain.Models
{
    public class ConfiguracionDocumento
    {
        public int idConfiguracionDocumento { get; set; }
        public int idPuntoEmision { get; set; }
        public long idTipoDocumento { get; set; }
        public bool generacionNro { get; set; }
        public int ultimaSecuencia { get; set; }
        public int codigoAmbiente { get; set; }
        public bool estado { get; set; }
    }
}
