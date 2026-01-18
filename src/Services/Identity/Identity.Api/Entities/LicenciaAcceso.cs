namespace Identity.Api.Entities;

[Table("LicenciaAcceso", Schema = "Seguridad")]
public class LicenciaAcceso : BaseEntity
{
    public required Licencia Licencia { get; set; }
    public int LicenciaId { get; set; }
    public required Role Role { get; set; }
    public int RoleId { get; set; }
    public ICollection<LicenciaAccesoDetalle> LicenciaAccesoDetalles { get; set; } = [];
}