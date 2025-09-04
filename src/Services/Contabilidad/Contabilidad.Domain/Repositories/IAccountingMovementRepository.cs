namespace Contabilidad.Domain.Repositories;

public interface IAccountingMovementRepository
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
}
