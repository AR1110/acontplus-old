using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Dtos
{
    public class TaxeXmlDto
    {
        public int codigo { get; set; }
        public int codigoPorcentaje { get; set; }
        public decimal descuentoAdicional { get; set; }
        public decimal baseImponible { get; set; }
        public decimal valor { get; set; }
    }
}
