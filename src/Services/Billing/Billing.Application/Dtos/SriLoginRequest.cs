namespace Billing.Application.DTOs;

public class SriLoginRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
    public string? AdditionalCi { get; set; }
}
