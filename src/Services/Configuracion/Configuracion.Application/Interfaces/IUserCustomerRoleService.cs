namespace Configuracion.Application.Interfaces;

public interface IUserCustomerRoleService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
}
