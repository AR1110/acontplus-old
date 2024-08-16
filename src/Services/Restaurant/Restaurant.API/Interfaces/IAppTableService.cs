using Common.Core.Models;
using Restaurant.API.Entities;

namespace Restaurant.API.Interfaces;

public interface IAppTableService
{
    Task<ApiResponse> GetAsync(string codEstab);
    Task<ApiResponse> AddAsync(AppTable appTable);
    Task<ApiResponse> UpdateAsync(int id, AppTable appTable);
    Task<ApiResponse> DeleteAsync(int userId, int id);
}
