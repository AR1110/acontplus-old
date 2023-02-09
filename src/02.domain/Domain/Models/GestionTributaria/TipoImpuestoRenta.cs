using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.GestionTributaria
{
    public class TipoImpuestoRenta
    {
        public long idTipoImpuestoRenta { get; set; }
        public string descripcion { get; set; }
        public string codigo { get; set; }
        public bool estado { get; set; }
    }
}
