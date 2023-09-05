namespace Domain.Models
{
    public class Persona
    {
        public int idPersona { get; set; }
        public string numeroIdentificacion { get; set; }
        public string nombreFiscal { get; set; }
        public string nombreComercial { get; set; }
        public string direccion { get; set; }
        public string telefono { get; set; }
        public string correo { get; set; }
        public bool estado { get; set; }
        public string fechaRegistro { get; set; }
        public int idUsuario { get; set; }
        public int idRol { get; set; }
        public int totalRecords { get; set; }
    }

    public class PersonaOperaciones
    {
        public Persona persona { get; set; }
        public TipoIdentificacionTransaccion tipoIdentificacionTransaccion { set; get; }
        public TipoClienteProveedor tipoClienteProveedor { get; set; }
        public TipoEntidad tipoEntidad { get; set; }
        public Ciudad ciudad { get; set; }
        public SubContribuyente subContribuyente { get; set; }
        public TiempoCredito tiempoCredito { get; set; }
        public TipoPersona tipoPersona { get; set; }
        public ConfiguracionPersona configuracionPersona { get; set; }
    }
}
