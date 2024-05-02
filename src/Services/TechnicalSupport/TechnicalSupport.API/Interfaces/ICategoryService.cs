namespace TechnicalSupport.API.Interfaces
{
    public interface ICategoryService
    {
        public Task<ApiResponse> AddAsync(Category category);
        public Task<ApiResponse> DeleteAsync(int userId, int id);
        public Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
        public Task<ApiResponse> UpdateAsync(int id, Category category);
    }
}
