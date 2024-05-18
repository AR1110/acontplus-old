using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.Core.Models;

namespace Configuracion.API.Interfaces
{
    public interface IUserCustomerRoleService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
    }
}
