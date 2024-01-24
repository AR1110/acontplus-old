namespace Contabilidad.Core.Interfaces
{
    public interface IMovimientoCajaService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<string> AddAsync(Dictionary<string, object> parameters);
        Task<string> DeleteAsync(Dictionary<string, object> parameters);
    }
}
