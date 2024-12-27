using Common.AppSettings;

namespace FactElect.API.Interfaces;

public interface ICompanyCustomerService
{
    Task<string> AddAsync(Dictionary<string, object> data);
    Task<string> DeleteAsync(Dictionary<string, object> data);
    Task<LegacyApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<LegacyApiResponse> SearchAsync(Dictionary<string, object> parameters);
    Task<LegacyApiResponse> GetIdAsync(Dictionary<string, object> parameters);
    Task<string> UpdateAsync(Dictionary<string, object> data);
}
