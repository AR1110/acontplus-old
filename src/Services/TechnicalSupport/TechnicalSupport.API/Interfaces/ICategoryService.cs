using Common.Core.Models;
using TechnicalSupport.API.Entities;

namespace TechnicalSupport.API.Interfaces
{
    public interface ICategoryService
    {
        public Task<ApiResponse> AddAsync(Category category);
        public Task<ApiResponse> DeleteAsync(int userId, int id);
        public Task<ApiResponse> GetAsync();
        public Task<ApiResponse> UpdateAsync(int id, Category category);
    }
}
