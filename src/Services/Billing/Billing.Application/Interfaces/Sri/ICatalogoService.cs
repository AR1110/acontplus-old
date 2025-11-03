namespace Billing.Application.Interfaces.Sri;

public interface ICatalogoService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
}
