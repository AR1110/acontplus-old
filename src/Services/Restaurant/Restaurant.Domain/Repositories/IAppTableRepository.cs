using Restaurant.Domain.Entities;

namespace Restaurant.Domain.Repositories;

public interface IAppTableRepository
{
    Task<SpResponse> GetByEstabAsync(string codEstab);
    Task<SpResponse> AddAsync(AppTable appTable);
    Task<SpResponse> UpdateAsync(int id, AppTable appTable);
    Task<SpResponse> UnassignAsync(int userId, int id);
    Task<SpResponse> DeleteAsync(int userId, int id);
}
