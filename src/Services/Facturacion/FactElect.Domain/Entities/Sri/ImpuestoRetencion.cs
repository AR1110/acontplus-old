namespace FactElect.Domain.Entities.Sri;

[Table("ImpuestoRetencion", Schema = "Sri")]
public class ImpuestoRetencion : BaseEntity
{
    [Required, MaxLength(1)] public string Codigo { get; set; }

    [Required, MaxLength(50)] public string Descripcion { get; set; }
}