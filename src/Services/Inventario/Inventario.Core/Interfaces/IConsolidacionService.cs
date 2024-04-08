using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Inventario.Core.Interfaces
{
    public interface IConsolidacionService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<object> GetIdAsync(Dictionary<string, object> parameters);
        Task<string> AddAsync(Dictionary<string, object> parameters);
        Task<string> UpdateAsync(Dictionary<string, object> parameters);
        Task<string> DeleteAsync(Dictionary<string, object> parameters);
    }
}
