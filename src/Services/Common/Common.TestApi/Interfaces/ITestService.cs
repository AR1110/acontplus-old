using Common.Core.Models;

namespace Common.TestApi.Interfaces
{
    public interface ITestService
    {
        Task<ApiResponse> GetAsync();
    }
}
