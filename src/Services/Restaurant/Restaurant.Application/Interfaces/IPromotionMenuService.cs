namespace Restaurant.Application.Interfaces;

public interface IPromotionMenuService
{
    public Task<SpResponse> GetByIdAsync(Dictionary<string, object> parameters);
}
