namespace Billing.Application.DTOs;

public class SriLoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? AdditionalCi { get; set; }
}
