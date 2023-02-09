using System.Collections.Generic;

namespace Domain.Dtos
{
    public class LiquidacionCompraAuthDto
    {
        public LiquidacionCompraXmlDto liquidacion { get; set; }
        public List<LiquidacionCompraDetalleXmlDto> detail { get; set; }
        public List<LiquidacionCompraFormaPagoXmlDto> formaPago { get; set; }
        public List<InfoAdicionalDto> infoAdicional { get; set; }
        public AuthorizationDto auth { get; set; }
    }
}
