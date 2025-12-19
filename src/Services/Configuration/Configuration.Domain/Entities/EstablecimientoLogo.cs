namespace Configuration.Domain.Entities;

[Table("EstablecimientoLogo", Schema = "Config")]
public class EstablecimientoLogo : BaseEntity
{
    public int EstablecimientoId { get; set; }
    public byte[] Content { get; set; }

    [MaxLength(50)] public required string ContentType { get; set; }

    [MaxLength(300)] public string FileName { get; set; }

    public int LatestVersion { get; set; }
    public bool? IsCompressed { get; set; }
}
