namespace Billing.Application.Interfaces.Sri;

public interface ISriAuthenticationService
{
  Task<SriAuthenticationResult> AuthenticateAsync(string username, string password, string? additionalCi = null);
  Task<SriDocumentsResponse> GetReceivedDocumentsAsync(SriDocumentsRequest request);
}
