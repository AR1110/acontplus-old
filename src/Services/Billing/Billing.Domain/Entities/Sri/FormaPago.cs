namespace Billing.Domain.Entities.Sri;

[Table("FormaPago", Schema = "Sri")]
public class FormaPago : BaseEntity
{
  [MaxLength(5)] public required string Codigo { get; set; }
  [MaxLength(200)] public required string Descripcion { get; set; }
  public DateOnly? FechaInicio { get; set; }
  public DateOnly? FechaFin { get; set; }
}
