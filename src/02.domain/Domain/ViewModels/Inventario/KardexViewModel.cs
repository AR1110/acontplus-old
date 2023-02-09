using Domain.Models.Inventario;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class KardexViewModel
    {
        public Dictionary<string,string> llevaInventario { get; set; }
        public List<Dictionary<string,object>> articles { get; set; }
    }
}
