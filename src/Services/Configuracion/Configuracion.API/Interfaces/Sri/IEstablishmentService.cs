 
using Common.Core.Models;

namespace Configuracion.API.Interfaces.Sri
{
    public interface IEstablishmentService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
    }
}
