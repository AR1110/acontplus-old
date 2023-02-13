namespace Domain.Auth.Models
{
    public class AuthResponse
    {
        public int idUsuarioRol { get; set; }
        public string userName { get; set; }
        public string jwtToken { get; set; }
        public int expiresIn{ get; set; }
    }
}
