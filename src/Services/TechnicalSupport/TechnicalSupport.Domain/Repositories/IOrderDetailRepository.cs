namespace TechnicalSupport.Domain.Repositories;

public interface IOrderDetailRepository
{
  public Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
  public Task<ApiResponse> DeleteAsync(int userId, int id);
  public Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
  public Task<ApiResponse> UpdateAsync(int id, Dictionary<string, object> parameters);
}
