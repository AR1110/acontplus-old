using Common.Core.Models;

namespace Contabilidad.Domain.Repositories;

public interface IAccountingMovementRepository
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}
