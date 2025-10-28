namespace Restaurant.Application.Interfaces;

public interface IItemService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> GetByIdAsync(int id);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
}
