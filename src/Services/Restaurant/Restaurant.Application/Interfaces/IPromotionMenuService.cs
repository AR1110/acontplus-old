namespace Restaurant.Application.Interfaces;

public interface IPromotionMenuService
{
    public Task<ApiResponse> GetByIdAsync(Dictionary<string, object> parameters);
}
