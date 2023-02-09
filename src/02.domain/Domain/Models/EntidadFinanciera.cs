using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class EntidadFinanciera
    {
        public int idEntidadFinanciera { get; set; }
        public int idFormaPagoSri { get; set; }
        public string descripcion { get; set; }
        public bool detalle { get; set; }
        public string codigo { get; set; }
        public bool estado { get; set; }
    }
}
