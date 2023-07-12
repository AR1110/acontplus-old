namespace Domain.Models
{
    public class ConfiguracionMora
    {
        public int idConfiguracionMora { get; set; }
        public int idEntidad { get; set; }
        public int diasGracia { get; set; }
        public decimal porcentajeMora { get; set; }
        public bool tiempoConfiguracion { get; set; }
        public bool estado { get; set; }
    }
}
