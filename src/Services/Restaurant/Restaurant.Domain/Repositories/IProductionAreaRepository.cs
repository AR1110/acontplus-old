using Restaurant.Domain.Entities;

namespace Restaurant.Domain.Repositories;

public interface IProductionAreaRepository
{
    Task<ApiResponse> AddAsync(ProductionArea productionArea);
    Task<ApiResponse> DeleteAsync(int userId, int id);
    Task<ApiResponse> GetAllAsync();
    Task<ApiResponse> GetByEstabAsync(int establecimientoId);
    Task<ApiResponse> UpdateAsync(int id, ProductionArea productionArea);
}