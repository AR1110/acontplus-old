namespace TechnicalSupport.Domain.Repositories;

public interface IBrandRepository
{
    public Task<SpResponse> AddAsync(Brand brand);
    public Task<SpResponse> DeleteAsync(int userId, int id);
    public Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    public Task<SpResponse> UpdateAsync(int id, Brand brand);
}
