 

namespace Inventario.Core.Interfaces
{
    public interface IArticuloFraccionadoService
    { 
        Task<object> GetAsync(Dictionary<string, object> parameters); 
    }
}
