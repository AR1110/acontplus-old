namespace Billing.Application.Interfaces;

public interface IDocumentoElectronicoErrorService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task CleanupProcessedErrorsAsync();
}
