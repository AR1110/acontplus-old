using System.Collections.Generic;

namespace Domain.Dtos
{
    public class RetencionAuthDto
    {
        public RetencionXmlDto retencion { get; set; }
        public List<RetencionDetalleXmlDto> detail { get; set; }
        public List<InfoAdicionalDto> infoAdicional { get; set; }
        public AuthorizationDto auth { get; set; }

    }
}
