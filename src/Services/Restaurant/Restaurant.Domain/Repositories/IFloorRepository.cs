using Restaurant.Domain.Entities;

namespace Restaurant.Domain.Repositories;

public interface IFloorRepository
{
    Task<SpResponse> AddAsync(Floor floor);
    Task<SpResponse> DeleteAsync(int userId, int id);
    Task<SpResponse> GetAllAsync();
    Task<SpResponse> GetByEstabAsync(int establecimientoId);
    Task<SpResponse> UpdateAsync(int id, Floor floor);
}
