using Common.AppSettings;

namespace FactElect.API.Interfaces;

public interface ICompanyCustomerService
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> data);
    Task<ApiResponse> DeleteAsync(Dictionary<string, object> data);
    Task<LegacyApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<LegacyApiResponse> SearchAsync(Dictionary<string, object> parameters);
    Task<LegacyApiResponse> GetIdAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> data);
}
