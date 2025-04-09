namespace FactElect.Domain.Entities.Sri;

[Table("ParaisoFiscal", Schema = "Sri")]
public class ParaisoFiscal : BaseEntity
{
    [Required, MaxLength(5)] public string Codigo { get; set; }

    [Required, MaxLength(150)] public string Descripcion { get; set; }

    public DateOnly? FechaInicio { get; set; }

    public DateOnly? FechaFin { get; set; }

    public Pais Pais { get; set; }

    public int PaisId { get; set; }
}