using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class ConfigComprobElect
    {
        public int idConfig_Comprob_Elect { get; set; }
        public string codEstab { get; set; }
        public string estab { get; set; }
        public string codigoPorcentaje { get; set; }
        public decimal porcentaje { get; set; }
        public int isAutomatic { get; set; }
    }
}
