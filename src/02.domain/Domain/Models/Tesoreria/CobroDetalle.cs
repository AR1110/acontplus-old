using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Tesoreria
{
    public class CobroDetalle
    {
        public long idCobroDetalle { get; set; }
        public long idCobro { get; set; }
        public long idCuotaXCobrar { get; set; }
        public decimal abono { get; set; }

    }
}
