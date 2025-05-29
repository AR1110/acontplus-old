using Restaurant.Domain.Entities;

namespace Restaurant.Application.Interfaces;

public interface IFloorService
{
    Task<ApiResponse> AddAsync(Floor floor);
    Task<ApiResponse> DeleteAsync(int userId, int id);
    Task<ApiResponse> GetAllAsync();
    Task<ApiResponse> GetByEstabAsync(int establecimientoId);
    Task<ApiResponse> UpdateAsync(int id, Floor floor);
}