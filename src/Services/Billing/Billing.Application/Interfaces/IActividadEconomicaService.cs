namespace Billing.Application.Interfaces;

public interface IActividadEconomicaService
{
    Task<Result<SpResponse, DomainError>> AddAsync(Dictionary<string, object> parameters);
    Task<Result<SpResponse, DomainError>> DeleteAsync(Dictionary<string, object> parameters);
    Task<Result<dynamic, DomainError>> GetAsync(Dictionary<string, object> parameters);
    Task<Result<SpResponse, DomainError>> UpdateAsync(Dictionary<string, object> parameters);
}