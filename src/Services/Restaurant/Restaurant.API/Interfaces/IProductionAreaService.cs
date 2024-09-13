using Common.Core.Models;
using Restaurant.API.Entities;

namespace Restaurant.API.Interfaces
{
    public interface IProductionAreaService
    {
        Task<ApiResponse> AddAsync(ProductionArea productionArea);
        Task<ApiResponse> DeleteAsync(int userId, int id);
        Task<ApiResponse> GetAllAsync();
        Task<ApiResponse> GetByEstabAsync(int establecimientoId);
        Task<ApiResponse> UpdateAsync(int id, ProductionArea productionArea);
    }
}
