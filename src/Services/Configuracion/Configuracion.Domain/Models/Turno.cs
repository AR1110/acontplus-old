namespace Configuracion.Domain.Models;

public class Turno
{
    public int IdTurno { get; set; }
    public string Descripcion { get; set; }
    public bool Estado { get; set; }
    public ICollection<Horario> Horarios { get; set; } =  new List<Horario>();
}
