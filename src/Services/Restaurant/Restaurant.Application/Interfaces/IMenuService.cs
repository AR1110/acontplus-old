namespace Restaurant.Application.Interfaces;

public interface IMenuService
{
    public Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    public Task<ApiResponse> PutAsync(Dictionary<string, object> parameters);
}
