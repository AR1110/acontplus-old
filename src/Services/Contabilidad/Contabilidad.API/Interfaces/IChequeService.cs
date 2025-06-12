namespace Contabilidad.API.Interfaces;

public interface IChequeService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}