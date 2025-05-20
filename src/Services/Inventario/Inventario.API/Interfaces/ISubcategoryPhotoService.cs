namespace Inventario.API.Interfaces;

public interface ISubcategoryPhotoService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> AddAsync(SubcategoryPhoto data);
    Task<ApiResponse> UpdateAsync(int id, SubcategoryPhoto data);
    Task<object> DeleteAsync(int id, int userId);
}