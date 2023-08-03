using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant.Core.Interfaces
{
    public interface IAppProductionAreaService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
    }
}
