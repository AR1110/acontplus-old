using Restaurant.Domain.Entities;

namespace Restaurant.Domain.Repositories;

public interface IFloorRepository
{
    Task<ApiResponse> AddAsync(Floor floor);
    Task<ApiResponse> DeleteAsync(int userId, int id);
    Task<ApiResponse> GetAllAsync();
    Task<ApiResponse> GetByEstabAsync(int establecimientoId);
    Task<ApiResponse> UpdateAsync(int id, Floor floor);
}