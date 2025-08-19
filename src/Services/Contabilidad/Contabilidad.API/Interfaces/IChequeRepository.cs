namespace Contabilidad.API.Interfaces;

public interface IChequeRepository
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}