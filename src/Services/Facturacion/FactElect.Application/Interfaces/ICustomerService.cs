namespace FactElect.Application.Interfaces;

public interface ICustomerService
{
    Task<ApiResponse> AddAsync(AppCustomer customer);
    Task<ApiResponse> DeleteAsync(int userId, int id);
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<DataTable> GetByIdCardAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(int id, AppCustomer customer);
}
