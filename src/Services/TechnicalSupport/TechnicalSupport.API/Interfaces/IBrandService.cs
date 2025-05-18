namespace TechnicalSupport.API.Interfaces;

public interface IBrandService
{
    public Task<ApiResponse> AddAsync(Brand brand);
    public Task<ApiResponse> DeleteAsync(int userId, int id);
    public Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    public Task<ApiResponse> UpdateAsync(int id, Brand brand);
}