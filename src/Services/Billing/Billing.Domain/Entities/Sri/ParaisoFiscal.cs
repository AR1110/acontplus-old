namespace Billing.Domain.Entities.Sri;

[Table("ParaisoFiscal", Schema = "Sri")]
public class ParaisoFiscal : BaseEntity
{
  [MaxLength(5)] public required string Codigo { get; set; }

  [MaxLength(150)] public required string Descripcion { get; set; }

  public DateOnly? FechaInicio { get; set; }

  public DateOnly? FechaFin { get; set; }

  public required Pais Pais { get; set; }

  public int PaisId { get; set; }
}
