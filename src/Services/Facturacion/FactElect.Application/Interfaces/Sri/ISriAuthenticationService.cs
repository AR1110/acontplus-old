namespace FactElect.Application.Interfaces.Sri;

public interface ISriAuthenticationService
{
    Task<SriAuthenticationResult> AuthenticateAsync(string username, string password, string? additionalCi = null);
}
