using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Dtos
{
    public class NotaCreditoAuthDto
    {
        public NotaCreditoXmlDto nota { get; set; }
        public List<NotaCreditoImpuestoXmlDto> taxes { get; set; }
        public List<NotaCreditoDetalleXmlDto> detail { get; set; }
        public List<InfoAdicionalDto> infoAdicional { get; set; }
        public AuthorizationDto auth { get; set; }
    }
}
