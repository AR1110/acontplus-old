namespace Compras.Domain.Repositories;

public interface IArticuloRepository
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}
