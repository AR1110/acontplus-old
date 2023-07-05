namespace Domain.Dtos
{
    public class LoginDto
    {
        public int id { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public bool rememberMe { get; set; }
        public string returnUrl { get; set; }
    }
}
