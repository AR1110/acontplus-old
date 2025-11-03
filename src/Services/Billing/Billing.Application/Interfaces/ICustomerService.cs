namespace Billing.Application.Interfaces;

public interface ICustomerService
{
    //Task<SpResponse> AddAsync(AppCustomer customer);
    //Task<SpResponse> DeleteAsync(int userId, int id);
    //Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<DataTable> GetByIdCardAsync(Dictionary<string, object> parameters);
    //Task<SpResponse> UpdateAsync(int id, AppCustomer customer);
}
