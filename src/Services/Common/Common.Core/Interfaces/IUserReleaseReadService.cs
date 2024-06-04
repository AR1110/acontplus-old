using Common.Core.Models;

namespace Common.Core.Interfaces
{
    public interface IUserReleaseReadService
    {
        Task<ApiResponse> AddAsync(ApiRequest apiRequest);
    }
}
