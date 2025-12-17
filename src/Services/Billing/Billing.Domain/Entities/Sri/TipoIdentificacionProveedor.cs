namespace Billing.Domain.Entities.Sri;

[Table("TipoIdentificacionProveedor", Schema = "Sri")]
public class TipoIdentificacionProveedor : BaseEntity
{
    [MaxLength(5)] public required string Codigo { get; set; }

    [MaxLength(100)] public required string Descripcion { get; set; }
}
