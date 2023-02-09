using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Horario
    {
        public int idHorario { get; set; }
        public int idTurno { get; set; }
        public int idDia { get; set; }
        public string apertura { get; set; }
        public string cierre { get; set; }
        public bool estado { get; set; }
    }
}
