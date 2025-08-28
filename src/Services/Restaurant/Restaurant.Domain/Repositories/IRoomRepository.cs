using Restaurant.Domain.Entities;

namespace Restaurant.Domain.Repositories;

public interface IRoomRepository
{
    Task<ApiResponse> AddAsync(Room room);
    Task<ApiResponse> DeleteAsync(int userId, int id);
    Task<ApiResponse> GetAllAsync();
    Task<ApiResponse> GetByEstabAsync(int establecimientoId);
    Task<ApiResponse> UpdateAsync(int id, Room room);
}
