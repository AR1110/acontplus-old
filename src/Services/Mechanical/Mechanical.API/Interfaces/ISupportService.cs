using Common.Core.Models;

namespace Mechanical.API.Interfaces
{
    public interface ISupportService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<string> AddAsync(Dictionary<string, object> parameters);
        Task<string> UpdateAsync(Dictionary<string, object> parameters);
        Task<string> DeleteAsync(Dictionary<string, object> parameters);
        Task<ApiResponseDeprecated> UpdateStateAsync(int id, int SupportStatusId);
    }
}
