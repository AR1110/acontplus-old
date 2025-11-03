namespace Accounting.Domain.Repositories;

public interface ITipoRepository
{
    Task<SpResponse> AddAsync(Tipo tipo);
    Task<SpResponse> DeleteAsync(int userId, int id);
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(int id, Tipo tipo);
}
