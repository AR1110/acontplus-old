namespace Identity.API.Dtos
{
    public class AuthRequestDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string ReturnUrl { get; set; }
        public string UserAgent { get; set; }
    }
}
