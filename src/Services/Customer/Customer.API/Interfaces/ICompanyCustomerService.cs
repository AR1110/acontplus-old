using Common.Core.Models;

namespace Customer.API.Interfaces
{
    public interface ICompanyCustomerService
    {
        Task<string> AddAsync(Dictionary<string, object> data);
        Task<string> DeleteAsync(Dictionary<string, object> data);
        Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> SearchAsync(Dictionary<string, object> parameters);
        Task<string> UpdateAsync(Dictionary<string, object> data);
    }
}
