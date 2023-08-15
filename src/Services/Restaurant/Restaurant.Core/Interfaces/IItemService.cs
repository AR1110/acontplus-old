using Lib.Common.Api;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant.Core.Interfaces
{
    public interface IItemService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<object> GetByIdAsync(int id);
        Task<string> UpdateAsync(int id, ApiRequest request);
        Task<string> DeleteAsync(int id, ApiRequest request);
    }
}
