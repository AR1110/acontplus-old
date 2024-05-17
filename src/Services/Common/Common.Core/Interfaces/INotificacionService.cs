using Common.Core.Models;

namespace Common.Core.Interfaces
{
    public interface INotificacionService
    {
        Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    }
}
