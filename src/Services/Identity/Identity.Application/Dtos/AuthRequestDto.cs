namespace Identity.Application.Dtos;

public class AuthRequestDto
{
    public required string Username { get; set; }
    public required string Password { get; set; }
    public string? ReturnUrl { get; set; }
    public string? UserAgent { get; set; }
}
