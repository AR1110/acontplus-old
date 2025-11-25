namespace Identity.Api.DTOs;

public class JwtResponseDto
{
    public required string Token { get; set; }
    public DateTime Expires { get; set; }
}
