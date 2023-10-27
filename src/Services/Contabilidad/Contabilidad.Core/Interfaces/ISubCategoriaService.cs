using Common.Core.Models;
using Contabilidad.Core.Entities;

namespace Contabilidad.Core.Interfaces
{
    public interface ISubCategoriaService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<APIResponse> InsertAsync(SubCategoria data);
    }
}
