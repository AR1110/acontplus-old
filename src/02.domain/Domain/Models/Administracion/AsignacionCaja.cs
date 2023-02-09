using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class AsignacionCaja
    {
        public int idAsignacionCaja { get; set; }
        public int idCaja { get; set; }
        public int idUsuario { get; set; }
        public int idTurno { get; set; }
    }
}
