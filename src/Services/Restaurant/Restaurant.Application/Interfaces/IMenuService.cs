namespace Restaurant.Application.Interfaces;

public interface IMenuService
{
    public Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    public Task<SpResponse> PutAsync(Dictionary<string, object> parameters);
}
