namespace FactElect.Domain.Entities.Sri;

[Table("TipoRegimenFiscalExterior", Schema = "Sri")]
public class TipoRegimenFiscalExterior : BaseEntity
{
    [Required, MaxLength(5)] public string Codigo { get; set; }

    [Required, MaxLength(300)] public string Descripcion { get; set; }
}