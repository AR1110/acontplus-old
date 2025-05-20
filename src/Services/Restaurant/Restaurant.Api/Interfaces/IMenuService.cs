namespace Restaurant.Api.Interfaces;

public interface IMenuService
{
    public Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    public Task<ApiResponse> PutAsync(int id, ApiRequest request);
}