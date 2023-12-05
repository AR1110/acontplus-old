using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FactElect.Core.Interfaces
{
    public interface DocumentoElectronicoError
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
    }
}
