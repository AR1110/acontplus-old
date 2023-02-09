using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Config
{
    public class BodegAsig
    {
        public int idBodeg_Asig { get; set; }
        public string codEstab_Asig { get; set; }
        public int idBodega { get; set; }
        public bool predeterminado { get; set; }
        public bool estado { get; set; }
    }
}
