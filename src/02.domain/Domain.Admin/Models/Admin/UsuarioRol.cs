namespace Domain.Admin.Models
{
    public class UsuarioRol
    {
        public int idUsuarioRol { get; set; }
        public int idUsuario { get; set; }
        public int idEntidad { get; set; }
        public int idRol { get; set; }
        public string nroIdentificacion { get; set; }
        public string ruc { get; set; }
        public string codPolitica { get; set; }
        public bool estado { get; set; }
    }
}
