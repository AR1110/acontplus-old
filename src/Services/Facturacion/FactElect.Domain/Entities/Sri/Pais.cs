namespace FactElect.Domain.Entities.Sri;

[Table("Pais", Schema = "Sri")]
public class Pais : BaseEntity
{
    [Required, MaxLength(5)] public string Codigo { get; set; }

    [Required, MaxLength(150)] public string Descripcion { get; set; }

    public ICollection<ParaisoFiscal> ParaisosFiscales { get; set; }
}