using Common.Core.Models;

namespace Configuracion.API.Interfaces
{
    public interface IEstablecimientoAsignacionService
    {
        Task<string> GetAsync(Dictionary<string, object> parameters);
        Task<object> GetDataFormAsync(Dictionary<string, object> parameters);
        Task<string> AddAsync(ApiRequest data);
        Task<string> UpdateAsync(Dictionary<string, object> parameters);
    }
}
