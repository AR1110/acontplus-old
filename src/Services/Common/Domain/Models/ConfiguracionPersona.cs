namespace Domain.Models
{
    public class ConfiguracionPersona
    {
        public int idConfiguracionPersona { get; set; }
        public Persona persona { get; set; }
        public decimal montoCredito { get; set; }
        public string token { get; set; }
    }
}
