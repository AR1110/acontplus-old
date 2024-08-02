namespace Contabilidad.API.Interfaces;

public interface ISubEntidadFinancieraService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<string> AddAsync(Dictionary<string, object> parameters);
    Task<string> UpdateAsync(Dictionary<string, object> parameters);
    Task<string> DeleteAsync(Dictionary<string, object> parameters);
}
