namespace FactElect.Domain.Entities.Sri;

[Table("FormaPago", Schema = "Sri")]
public class FormaPago : BaseEntity
{
    [Required, MaxLength(5)] public string Codigo { get; set; }
    [Required, MaxLength(150)] public string Descripcion { get; set; }
    public DateOnly? FechaInicio { get; set; }
    public DateOnly? FechaFin { get; set; }
}
