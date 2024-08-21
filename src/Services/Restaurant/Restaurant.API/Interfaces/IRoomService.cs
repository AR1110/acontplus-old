using Common.Core.Models;
using Restaurant.API.Entities;

namespace Restaurant.API.Interfaces;

public interface IRoomService
{
    Task<ApiResponse> AddAsync(Room room);
    Task<ApiResponse> DeleteAsync(int userId, int id);
    Task<ApiResponse> GetAllAsync();
    Task<ApiResponse> GetByEstabAsync(string codEstab);
    Task<ApiResponse> UpdateAsync(int id, Room room);
}
