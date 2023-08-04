using Lib.Common.Api;
using Restaurant.Core.Entities;

namespace Restaurant.Core.Interfaces
{
    public interface IAppTableService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);        
        Task<string> AddAsync(ApiRequest request);
        Task<string> UpdateAsync(int id, ApiRequest request);
        Task<string> DeleteAsync(int id, ApiRequest request);

    }
}
