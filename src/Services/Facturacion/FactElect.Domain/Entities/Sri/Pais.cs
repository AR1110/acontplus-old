namespace FactElect.Domain.Entities.Sri;

[Table("Pais", Schema = "Sri")]
public class Pais : BaseEntity
{
    [Required, MaxLength(5)] public required string Codigo { get; init; }

    [Required, MaxLength(150)] public required string Descripcion { get; init; }

    public required ICollection<ParaisoFiscal> ParaisosFiscales { get; init; }
}