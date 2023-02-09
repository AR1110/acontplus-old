using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class ContraPartidaCaja
    {
        public int idContraPartidaCaja { get; set; }
        public int idContraPartida { get; set; }
        public int idCaja { get; set; }
        public bool estado { get; set; }
    }
}
