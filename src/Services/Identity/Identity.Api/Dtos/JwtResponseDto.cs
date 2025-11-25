namespace Identity.Api.Dtos;

public class JwtResponseDto
{
    public required string Token { get; set; }
    public DateTime Expires { get; set; }
}
