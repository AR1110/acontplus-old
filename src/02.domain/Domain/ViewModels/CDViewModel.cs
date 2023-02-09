using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class CDViewModel
    {
        public ConfiguracionDocumento configDoc { get; set; }
        public string nombreDoc { get; set; }
        public string ambiente { get; set; }
    }
}
