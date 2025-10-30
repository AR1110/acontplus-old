namespace Billing.Domain.Entities.Sri;

[Table("TipoRegimenFiscalExterior", Schema = "Sri")]
public class TipoRegimenFiscalExterior : BaseEntity
{
    [Required][MaxLength(5)] public required string Codigo { get; set; }

    [Required][MaxLength(100)] public required string Descripcion { get; set; }
}