using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Config
{
    public class EstabAsig
    {
        public int idEstab_Asig { get; set; }
        public string codEstab_Asig { get; set; }
        public int idUsuarioRol { get; set; }
        public string codEstab { get; set; }
        public bool predeterminado { get; set; }
    }
}
