namespace Identity.API.Dtos
{
    public class ForgotPasswordDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
