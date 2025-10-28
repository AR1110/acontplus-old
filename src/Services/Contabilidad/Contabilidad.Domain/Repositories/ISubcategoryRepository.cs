namespace Contabilidad.Domain.Repositories;

public interface ISubcategoryRepository
{
    Task<SpResponse> AddAsync(Subcategory subcategory);
    Task<SpResponse> DeleteAsync(int userId, int id);
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(int id, Subcategory subcategory);
}
