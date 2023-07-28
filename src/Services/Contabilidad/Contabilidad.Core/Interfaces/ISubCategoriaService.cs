using Contabilidad.Core.Entities;
using Lib.Common.Api;

namespace Contabilidad.Core.Interfaces
{
    public interface ISubCategoriaService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<APIResponse> InsertAsync(SubCategoria data);
    }
}
