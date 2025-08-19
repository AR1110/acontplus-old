using Restaurant.Domain.Entities;

namespace Restaurant.Application.Interfaces;

public interface IAppTableService
{
    Task<ApiResponse> GetByEstabAsync(string codEstab);
    Task<ApiResponse> AddAsync(AppTable appTable);
    Task<ApiResponse> UpdateAsync(int id, AppTable appTable);
    Task<ApiResponse> UnassignAsync(int userId, int id);
    Task<ApiResponse> DeleteAsync(int userId, int id);
}