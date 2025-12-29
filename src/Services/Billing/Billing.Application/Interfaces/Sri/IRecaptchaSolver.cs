namespace Billing.Application.Interfaces.Sri;

public interface IRecaptchaSolver
{
    Task<RecaptchaSolveResult> SolveAsync(string siteKey, string pageUrl, int timeoutSeconds, CancellationToken cancellationToken = default);
}
