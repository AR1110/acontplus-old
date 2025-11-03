namespace Inventory.Domain.Repositories;

public interface ISubcategoryPhotoRepository
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> AddAsync(SubcategoryPhoto data);
    Task<SpResponse> UpdateAsync(int id, SubcategoryPhoto data);
    Task<object> DeleteAsync(int id, int userId);
}
