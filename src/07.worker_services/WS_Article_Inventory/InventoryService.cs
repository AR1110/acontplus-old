using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WS_Article_Inventory
{
    public sealed class InventoryService
    {
        private readonly IConfiguration _config;
        public InventoryService(IConfiguration config) => (_config) = (config);
    }
}
