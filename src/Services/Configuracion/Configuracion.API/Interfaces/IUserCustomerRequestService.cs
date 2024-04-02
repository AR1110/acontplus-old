using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Configuracion.API.Interfaces
{
    public interface IUserCustomerRequestService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<string> UpdateAsync(Dictionary<string, object> parameters);

    }
}
