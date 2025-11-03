namespace Billing.Application.Interfaces;

public interface INotificacionTributariaService
{
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
}
