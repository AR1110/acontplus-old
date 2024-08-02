namespace TechnicalSupport.API.Interfaces;

public interface IOrderDetailService
{
    public Task<ApiResponse> AddAsync(ApiRequest data);
    public Task<ApiResponse> DeleteAsync(int userId, int id);
    public Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    public Task<ApiResponse> UpdateAsync(int id, ApiRequest data);
}
