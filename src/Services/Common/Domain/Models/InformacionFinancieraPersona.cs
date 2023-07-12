namespace Domain.Models
{
    public class InformacionFinancieraPersona
    {
        public int idInformacionFinancieraPersona { get; set; }
        public string numeroIdentificacion { get; set; }
        public string nombreRepresentante { get; set; }
        public string numeroCuenta { get; set; }
        public bool estado { get; set; }
        public string fechaRegistro { get; set; }
        public int idUsuario { get; set; }
    }
}