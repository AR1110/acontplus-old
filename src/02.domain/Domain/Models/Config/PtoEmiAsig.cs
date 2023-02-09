using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class PtoEmiAsig
    {
        public int idPtoEmi_Asig { get; set; }
        public string codEstab_Asig { get; set; }
        public int idPuntoEmision { get; set; }
        public string ptoEmi { get; set; }
        public bool predeterminado { get; set; }
        public bool estado { get; set; }
    }
}
