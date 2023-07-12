using Domain.Models;

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
