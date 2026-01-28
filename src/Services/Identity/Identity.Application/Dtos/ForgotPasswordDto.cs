namespace Identity.Application.Dtos;

public class ForgotPasswordDto
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
}
