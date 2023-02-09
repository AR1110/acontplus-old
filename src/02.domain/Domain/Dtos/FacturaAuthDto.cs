using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Dtos
{
    public class FacturaAuthDto
    {
        public FacturaXmlDto factura { get; set; }
        public List<FacturaDetalleXmlDto> detail { get; set; }
        public List<FacturaFormaPagoXmlDto> formaPago { get; set; }
        public AuthorizationDto auth { get; set; }
        public List<InfoAdicionalDto> infoAdicional { get; set; }
    }
}
