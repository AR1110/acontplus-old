using Common.Core.Models;

namespace Compras.API.Interfaces
{
    public interface IProveedorService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<string> AddAsync(ApiRequest request);
        //Task<string> Updatesync(Dictionary<string, object> parameters);
        //Task<string> DeleteAsync(Dictionary<string, object> parameters);
    }
}
