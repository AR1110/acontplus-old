namespace FactElect.Domain.Entities.Sri;

[Table("SustentoTributario", Schema = "Sri")]
public class SustentoTributario : BaseEntity
{
    [Required, MaxLength(5)] public string Codigo { get; set; }

    [Required, MaxLength(300)] public string Descripcion { get; set; }

    public DateOnly? FechaInicio { get; set; }

    public DateOnly? FechaFin { get; set; }

    public ICollection<DocumentoSustentoTributario> DocumentosSustentoTributario { get; set; }
}