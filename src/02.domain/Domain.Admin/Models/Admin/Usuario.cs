namespace Domain.Admin.Models
{
    public class Usuario
    {
        public int idUsuario { get; set; }
        public string nombre { get; set; }
        public string apellido { get; set; }
        public string nombreUsuario { get; set; }
        public string contrasena { get; set; }
        public string nroIdentificacion { get; set; }
        public string correo { get; set; }
        public bool estado { get; set; }
    }
}
