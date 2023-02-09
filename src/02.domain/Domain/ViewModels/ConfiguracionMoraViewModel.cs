using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class ConfiguracionMoraViewModel
    {
        public ConfiguracionMora configuracionMora { get; set; }
        public int totalRecords { get; set; }
        public string diaGracia { get; set; }
        public string configuracion { get; set; }
    }
}
