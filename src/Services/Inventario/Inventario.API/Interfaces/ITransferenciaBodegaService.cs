namespace Inventario.API.Interfaces;

public interface ITransferenciaBodegaService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<object> GetIdAsync(Dictionary<string, object> parameters);
    Task<string> AddAsync(Dictionary<string, object> parameters);
    Task<string> UpdateAsync(Dictionary<string, object> parameters);
    Task<string> DeleteAsync(Dictionary<string, object> parameters);
}
