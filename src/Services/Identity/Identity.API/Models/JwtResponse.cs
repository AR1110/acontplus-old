namespace Identity.API.Models;

public class JwtResponse
{
    public required string Token { get; set; }
    public DateTime Expires { get; set; }
}
