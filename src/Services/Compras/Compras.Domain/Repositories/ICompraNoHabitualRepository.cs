namespace Compras.Domain.Repositories;

public interface ICompraNoHabitualRepository
{
    Task<object> GetAsync(Dictionary<string, object> parameters);

    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);

    //  Task<object> GetByIdAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
    Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters);
}
