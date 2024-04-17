using Common.Core.Models;
using TechnicalSupport.API.Entities;

namespace TechnicalSupport.API.Interfaces
{
    public interface IBrandService
    {
        public Task<ApiResponse> AddAsync(Brand brand);
        public Task<ApiResponse> DeleteAsync(int userId, int id);
        public Task<ApiResponse> GetAsync();
        public Task<ApiResponse> UpdateAsync(int id, Brand brand);
    }
}
