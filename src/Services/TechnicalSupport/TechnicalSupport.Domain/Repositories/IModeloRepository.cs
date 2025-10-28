namespace TechnicalSupport.Domain.Repositories;

public interface IModeloRepository
{
    public Task<SpResponse> AddAsync(Modelo modelo);
    public Task<SpResponse> DeleteAsync(int userId, int id);
    public Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    public Task<SpResponse> UpdateAsync(int id, Modelo modelo);
}
