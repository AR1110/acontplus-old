namespace Domain.Auth.Models
{
    public class AuthResponse
    {
        public string jwtToken { get; set; }
        public int expiresIn { get; set; }
    }
}
