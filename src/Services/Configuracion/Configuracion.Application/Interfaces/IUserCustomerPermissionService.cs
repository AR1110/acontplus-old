namespace Configuracion.Application.Interfaces;

public interface IUserCustomerPermissionService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}
