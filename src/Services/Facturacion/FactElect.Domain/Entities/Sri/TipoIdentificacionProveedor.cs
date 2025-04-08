namespace FactElect.Domain.Entities.Sri;

[Table("TipoIdentificacionProveedor", Schema = "Sri")]
public class TipoIdentificacionProveedor : BaseEntity
{
    [Required, MaxLength(5)] public string Codigo { get; set; }

    [Required, MaxLength(100)] public string Descripcion { get; set; }
}