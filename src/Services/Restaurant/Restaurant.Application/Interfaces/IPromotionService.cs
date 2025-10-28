namespace Restaurant.Application.Interfaces;

public interface IPromotionService
{
    public Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    public Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    public Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
}
