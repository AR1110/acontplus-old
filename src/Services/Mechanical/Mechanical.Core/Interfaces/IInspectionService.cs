using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mechanical.Core.Interfaces
{
    public interface IInspectionService 
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<string> AddAsync(Dictionary<string, object> parameters);
        Task<string> UpdateAsync(Dictionary<string, object> parameters);
    }
}
