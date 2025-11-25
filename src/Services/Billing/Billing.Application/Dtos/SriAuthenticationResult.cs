namespace Billing.Application.Dtos;

public class SriAuthenticationResult
{
    public bool IsSuccess { get; set; }
    public string? ErrorMessage { get; set; }
    public string? AccessToken { get; set; }
    public string? RefreshToken { get; set; }
    public string? AuthorizationCode { get; set; }
    public int ExpiresIn { get; set; }
    public string? SessionCode { get; set; }
    public string? ExecutionCode { get; set; }
    public string? TabId { get; set; }
    public Dictionary<string, string> Cookies { get; set; } = [];
}
