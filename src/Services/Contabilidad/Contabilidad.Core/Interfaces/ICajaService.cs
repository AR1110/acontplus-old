namespace Contabilidad.Core.Interfaces
{
    public interface ICajaService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<object> GetAsigCajaUsuarioAsync(Dictionary<string, object> parameters);
        Task<string> AddAsync(Dictionary<string, object> parameters);
        Task<string> UpdateAsync(Dictionary<string, object> parameters);
        Task<string> DeleteAsync(int id);
    }
}
