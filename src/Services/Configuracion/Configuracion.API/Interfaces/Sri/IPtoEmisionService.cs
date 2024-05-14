using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.Core.Models;

namespace Configuracion.API.Interfaces.Sri
{
    public interface IPtoEmisionService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
    }
}
