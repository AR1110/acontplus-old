using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Configuracion.API.Interfaces
{
    public interface IUserCustomerRoleService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters); 
    }
}
