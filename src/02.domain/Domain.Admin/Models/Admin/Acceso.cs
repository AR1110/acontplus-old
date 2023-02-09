namespace Domain.Admin.Models.Admin
{
    public class Acceso
    {
        public int idAcceso { get; set; }
        public int idUsuarioRol { get; set; }
        public string menu { get; set; }
        public string subMenu { get; set; }
        public string accion { get; set; }
        public bool estado { get; set; }
    }
}
