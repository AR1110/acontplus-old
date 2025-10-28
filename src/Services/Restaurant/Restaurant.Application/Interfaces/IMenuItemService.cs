namespace Restaurant.Application.Interfaces;

public interface IMenuItemService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> GetIdAsync(Dictionary<string, object> parameters);
}
