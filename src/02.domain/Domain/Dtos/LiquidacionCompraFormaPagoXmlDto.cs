using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Dtos
{
    public class LiquidacionCompraFormaPagoXmlDto
    {
        public string formaPago { get; set; }
        public decimal total { get; set; }
        public int plazo { get; set; }
        public string unidadTiempo { get; set; }
    }
}
