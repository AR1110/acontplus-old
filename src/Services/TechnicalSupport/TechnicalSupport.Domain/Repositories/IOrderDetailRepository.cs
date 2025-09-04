namespace TechnicalSupport.Domain.Repositories;

public interface IOrderDetailRepository
{
    public Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    public Task<SpResponse> DeleteAsync(int userId, int id);
    public Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    public Task<SpResponse> UpdateAsync(int id, Dictionary<string, object> parameters);
}
