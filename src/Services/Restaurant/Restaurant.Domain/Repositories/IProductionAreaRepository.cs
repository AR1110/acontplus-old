using Restaurant.Domain.Entities;

namespace Restaurant.Domain.Repositories;

public interface IProductionAreaRepository
{
    Task<SpResponse> AddAsync(ProductionArea productionArea);
    Task<SpResponse> DeleteAsync(int userId, int id);
    Task<SpResponse> GetAllAsync();
    Task<SpResponse> GetByEstabAsync(int establecimientoId);
    Task<SpResponse> UpdateAsync(int id, ProductionArea productionArea);
}
