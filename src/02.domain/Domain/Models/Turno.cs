using Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Turno
    {
        public int idTurno { get; set; }
        public string descripcion { get; set; }
        public bool estado { get; set; }
        public List<Horario> horario { get; set; }
    }
}
