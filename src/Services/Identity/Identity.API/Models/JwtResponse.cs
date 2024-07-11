namespace Identity.API.Models;

public class JwtResponse
{
    public string Token { get; set; }
    public DateTime Expires { get; set; }
}
