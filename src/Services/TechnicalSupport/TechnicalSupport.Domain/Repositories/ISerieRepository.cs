namespace TechnicalSupport.Domain.Repositories;

public interface ISerieRepository
{
    public Task<SpResponse> AddAsync(Serie serie);
    public Task<SpResponse> DeleteAsync(int userId, int id);
    public Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    public Task<SpResponse> UpdateAsync(int id, Serie serie);
}
