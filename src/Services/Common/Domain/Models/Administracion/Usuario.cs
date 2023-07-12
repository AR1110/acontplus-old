namespace Domain.Models.Administracion
{
    public class Usuario
    {

        public int idUsuario { set; get; }
        public string nroIdentificacion { get; set; }
        public string nombreUsuario { get; set; }
        public string contrasenia { get; set; }
        public string nombreCompleto { get; set; }
        public string correo { get; set; }
        public bool rememberMe { get; set; }
        public string returnUrl { get; set; }
    }
}