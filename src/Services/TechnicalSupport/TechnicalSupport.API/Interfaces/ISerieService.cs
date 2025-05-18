namespace TechnicalSupport.API.Interfaces;

public interface ISerieService
{
    public Task<ApiResponse> AddAsync(Serie serie);
    public Task<ApiResponse> DeleteAsync(int userId, int id);
    public Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    public Task<ApiResponse> UpdateAsync(int id, Serie serie);
}