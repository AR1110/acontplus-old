namespace Inventario.API.Interfaces;

public interface ISubcategoryPhotoService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponseDeprecated> AddAsync(SubcategoryPhoto data);
    Task<ApiResponseDeprecated> UpdateAsync(int id, SubcategoryPhoto data);
    Task<object> DeleteAsync(int id, int userId);
}
