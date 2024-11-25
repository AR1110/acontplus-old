using Common.AppSettings;

namespace FactElect.API.Interfaces;

public interface ICompanyCustomerService
{
    Task<string> AddAsync(Dictionary<string, object> data);
    Task<string> DeleteAsync(Dictionary<string, object> data);
    Task<ApiResponseDeprecated> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponseDeprecated> SearchAsync(Dictionary<string, object> parameters);
    Task<ApiResponseDeprecated> GetIdAsync(Dictionary<string, object> parameters);
    Task<string> UpdateAsync(Dictionary<string, object> data);
}
