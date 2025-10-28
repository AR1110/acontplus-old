namespace FactElect.Application.Interfaces;

public interface ICompanyCustomerService
{
    Task<SpResponse> AddAsync(Dictionary<string, object> data);
    Task<SpResponse> DeleteAsync(Dictionary<string, object> data);
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> SearchAsync(Dictionary<string, object> parameters);
    Task<SpResponse> GetIdAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> data);
}
