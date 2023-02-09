using System.Collections.Generic;

namespace Domain.Dtos
{
    public class GuiaRemisionAuthDto
    {
        public GuiaRemisionXmlDto guia { get; set; }
        public List<GuiaRemisionDetalleXmlDto> detalle { get; set; }
        public List<InfoAdicionalDto> infoAdicional { get; set; }
        public AuthorizationDto auth { get; set; }
    }
}
