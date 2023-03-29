
using System.Drawing;
using System.Runtime.CompilerServices;

namespace Domain.Dtos.Contabilidad
{
    public class PagoDto
    {
        public string comprobante { get; set; }
        public string pago { get; set; }
        public string pagoDetalle { get; set; }
        public string historial { get; set; }
    }
}
