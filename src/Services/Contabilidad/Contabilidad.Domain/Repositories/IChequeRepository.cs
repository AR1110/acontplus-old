namespace Contabilidad.Domain.Repositories;

public interface IChequeRepository
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}