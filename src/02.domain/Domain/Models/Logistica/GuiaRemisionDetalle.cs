using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Logistica
{
    public class GuiaRemisionDetalle
    {
        public long idGuiaRemisionDetalle { get; set; }
        public long idGuiaRemision { get; set; }
        public long idArticulo { get; set; }
        public decimal cantidad { get; set; }
        public string descripcion { get; set; }
        public bool estado { get; set; }
    }
}
