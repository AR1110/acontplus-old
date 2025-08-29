namespace Restaurant.Application.Interfaces;

public interface IPromotionService
{
    public Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    public Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    public Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}
