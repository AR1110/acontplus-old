namespace Common.Domain.Entities;

[Table("Release", Schema = "Common")]
public class Release : BaseEntity
{
    private string? _decompressedContent;
    public required Aplicacion Aplicacion { get; set; }
    public int AplicacionId { get; set; }
    public DateTime ReleaseDate { get; set; }
    [MaxLength(10)] public string? Version { get; set; }
    [MaxLength(200)] public required string Title { get; set; }
    public bool LogoutRequired { get; set; }
    public required byte[] CompressedContent { get; set; }

    [NotMapped]
    public string Content
    {
        get
        {
            switch (_decompressedContent)
            {
                case null when CompressedContent != null:
                    {
                        var decompressedBytes = CompressionUtils.DecompressGZip(CompressedContent);
                        _decompressedContent = Encoding.UTF8.GetString(decompressedBytes);
                        break;
                    }
            }

            return _decompressedContent ?? string.Empty;
        }
        set
        {
            var stringBytes = Encoding.UTF8.GetBytes(value);
            CompressedContent = CompressionUtils.CompressGZip(stringBytes);
            _decompressedContent = value; // Cache the value
        }
    }
}