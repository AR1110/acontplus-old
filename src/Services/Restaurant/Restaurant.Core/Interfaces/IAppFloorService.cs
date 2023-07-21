using Lib.Common.Api;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant.Core.Interfaces
{
    public interface IAppFloorService
    {    
        Task<APIResponse> GetAsync(Dictionary<string, object> parameters);
    }
}
   


