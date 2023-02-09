using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Domain.Models
{
    public class Acceso
    {
        public int idAcceso { get; set; }
        public int idSubMenu { get; set; }
        public int idPolitica { get; set; }
        public bool leer { get; set; }
        public bool crear { get; set; }
        public bool editar { get; set; }
        public bool eliminar { get; set; }
        public bool reporte { get; set; }
        public bool enviarCorreo { get; set; }
        public bool cobroPago { get; set; }
        public bool enviarSri { get; set; }
        public bool historialFinanciero { get; set; }
        public bool cuota { get; set; }
        public bool anular { get; set; }
        public bool impuesto { get; set; }
        public bool kardex { get; set; }
        public bool imagen { get; set; }
        public bool acceso { get; set;   }
    }


}