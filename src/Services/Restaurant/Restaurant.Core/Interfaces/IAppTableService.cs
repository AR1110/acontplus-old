using Lib.Common.Api;
using Restaurant.Core.Entities;

namespace Restaurant.Core.Interfaces
{
    public interface IAppTableService
    {
        Task<APIResponse> GetAsync(Dictionary<string, object> parameters);
        //Task<AppTable> GetByIdAsync(int id);
        //Task<AppTable> AddAsync(AppTable table);
        //Task<AppTable> UpdateAsync(int id, AppTable table);
        //void RemoveAsync(AppTable table);
        //Task<APIResponse> SearchAsync(Dictionary<string, object> parameters);
    }
}
