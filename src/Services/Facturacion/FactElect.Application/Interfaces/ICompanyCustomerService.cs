namespace FactElect.Application.Interfaces;

public interface ICompanyCustomerService
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> data);
    Task<ApiResponse> DeleteAsync(Dictionary<string, object> data);
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> SearchAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetIdAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> data);
}
