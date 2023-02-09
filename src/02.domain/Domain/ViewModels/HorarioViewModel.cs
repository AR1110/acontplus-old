using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class HorarioViewModel
    {
        public Horario horario { get; set; }
        public string diaSemana { get; set; }
        public string diaLaborable { get; set; }
        public string clase { get; set; }
    }
}
