namespace Contabilidad.API.Interfaces;

public interface ISubcategoryService
{
    Task<ApiResponse> AddAsync(Subcategory subcategory);
    Task<ApiResponse> DeleteAsync(int userId, int id);
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(int id, Subcategory subcategory);
}
