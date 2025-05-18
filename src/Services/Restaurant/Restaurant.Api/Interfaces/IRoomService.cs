using Restaurant.Api.Entities;

namespace Restaurant.Api.Interfaces;

public interface IRoomService
{
    Task<ApiResponse> AddAsync(Room room);
    Task<ApiResponse> DeleteAsync(int userId, int id);
    Task<ApiResponse> GetAllAsync();
    Task<ApiResponse> GetByEstabAsync(int establecimientoId);
    Task<ApiResponse> UpdateAsync(int id, Room room);
}
