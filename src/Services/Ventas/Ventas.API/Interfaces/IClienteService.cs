namespace Ventas.API.Interfaces;

public interface IClienteService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetByIdAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetDataFormAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> SearchAsync(Dictionary<string, object> parameters);
}
