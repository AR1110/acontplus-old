using Common.Core.Models;

namespace Configuracion.API.Interfaces
{
    public interface IUserCustomerPermissionService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);

    }
}
