namespace Restaurant.Domain.Repositories;

public interface IOrderRepository
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    Task<SpResponse> PutAsync(Dictionary<string, object> parameters);
    Task<SpResponse> DeleteAsync(int userId, int id);
    Task<SpResponse> PrintAsync(Dictionary<string, object> parameters);
}
