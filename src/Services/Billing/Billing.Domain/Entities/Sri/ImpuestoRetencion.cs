namespace Billing.Domain.Entities.Sri;

[Table("ImpuestoRetencion", Schema = "Sri")]
public class ImpuestoRetencion : BaseEntity
{
  [MaxLength(1)] public required string Codigo { get; set; }

  [MaxLength(50)] public required string Descripcion { get; set; }
}
