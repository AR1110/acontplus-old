using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Dtos
{
    public class GuiaRemisionDetalleXmlDto
    {
        public string codigoInterno { get; set; }
        public string codigoAdicional { get; set; }
        public string descripcion { get; set; }
        public string cantidad { get; set; }
    }
}
