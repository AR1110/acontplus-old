namespace Configuracion.Domain.Models;

public class Turno
{
  public int? IdTurno { get; set; }
  public required string Descripcion { get; set; }
  public bool Estado { get; set; } = true;
  public List<Horario> Horarios { get; set; } = new();
}
