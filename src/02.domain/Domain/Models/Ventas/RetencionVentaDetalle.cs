using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Ventas
{
    public class RetencionVentaDetalle
    {
        public long idRetencionVentaDetalle { get; set; }
        public long idRetencionVenta { get; set; }
        public int idImpuesto { get; set; }
        public int idRetencion { get; set; }
        public decimal baseImponible { get; set; }
        public decimal porcentajeRetencion { get; set; }
        public decimal valorRetenido { get; set; }
    }
}
