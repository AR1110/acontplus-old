using Common.Core.Models;

namespace Identity.API.Interfaces
{
    public interface IUserService
    {
        Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    }
}
