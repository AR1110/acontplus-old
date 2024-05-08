using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.Core.Models;

namespace Ventas.API.Interfaces
{
    public interface IProformaService
    {
         Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<object> GetByIdAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> ConvertToDoc(Dictionary<string, object> parameters);
        
    }
}
