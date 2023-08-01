using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Inventario.Core.Interfaces
{
    public interface IRdlcReport
    {
        public Task<byte[]> Create(string spparams, string spname, string filename, string format);
    }
}