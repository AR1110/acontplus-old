namespace FactElect.Domain.Entities.Sri;

[Table("TipoIdentificacionProveedor", Schema = "Sri")]
public class TipoIdentificacionProveedor : BaseEntity
{
    [Required] [MaxLength(5)] public required string Codigo { get; set; }

    [Required] [MaxLength(100)] public required string Descripcion { get; set; }
}