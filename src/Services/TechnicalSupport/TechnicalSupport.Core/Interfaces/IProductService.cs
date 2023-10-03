using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TechnicalSupport.Core.Interfaces
{
    public interface IProductService
    {
        Task<string> GetAsync();
    }
}
