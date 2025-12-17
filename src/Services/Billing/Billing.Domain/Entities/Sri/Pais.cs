namespace Billing.Domain.Entities.Sri;

[Table("Pais", Schema = "Sri")]
public class Pais : BaseEntity
{
    [MaxLength(5)] public required string Codigo { get; set; }

    [MaxLength(150)] public required string Descripcion { get; set; }

    public required ICollection<ParaisoFiscal> ParaisosFiscales { get; set; }
}
