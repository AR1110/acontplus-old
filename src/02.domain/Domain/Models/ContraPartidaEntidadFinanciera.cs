using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class ContraPartidaEntidadFinanciera
    {
        public int idContraPartidaEntidadFinanciera { get; set; }
        public int idContraPartida { get; set; }
        public int idEntidadFinanciera { get; set; }
        public bool estado { get; set; }
    }
}
