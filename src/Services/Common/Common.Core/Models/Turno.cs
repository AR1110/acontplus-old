namespace Common.Core.Models
{
    public class Turno
    {
        public int idTurno { get; set; }
        public string descripcion { get; set; }
        public bool estado { get; set; }
        public List<Horario> horario { get; set; }
    }
}
