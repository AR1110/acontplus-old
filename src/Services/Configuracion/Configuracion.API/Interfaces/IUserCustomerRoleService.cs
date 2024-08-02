namespace Configuracion.API.Interfaces;

public interface IUserCustomerRoleService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}
