namespace FactElect.Application.DTOs;

public class SriAuthenticationResult
{
    public bool IsSuccess { get; set; }
    public string? AccessToken { get; set; }
    public string? RefreshToken { get; set; }
    public string? SessionCode { get; set; }
    public string? ExecutionCode { get; set; }
    public Dictionary<string, string> Cookies { get; set; } = new();
    public string? ErrorMessage { get; set; }
    public DateTime ExpiresAt { get; set; }
}
