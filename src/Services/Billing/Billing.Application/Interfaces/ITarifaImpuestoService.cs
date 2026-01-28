namespace Billing.Application.Interfaces;

public interface ITarifaImpuestoService
{
    Task<Result<SpResponse, DomainError>> AddAsync(TarifaImpuesto tarifaImpuesto);
    Task<Result<SpResponse, DomainError>> DeleteAsync(Dictionary<string, object> parameters);
    Task<Result<dynamic, DomainError>> GetAsync(Dictionary<string, object> parameters);
    Task<Result<SpResponse, DomainError>> UpdateAsync(int id, TarifaImpuesto tarifaImpuesto);
}