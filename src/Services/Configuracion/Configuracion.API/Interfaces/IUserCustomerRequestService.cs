namespace Configuracion.API.Interfaces;

public interface IUserCustomerRequestService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}
