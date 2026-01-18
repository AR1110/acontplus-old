namespace Common.Domain.Entities;

[Table("UserManual", Schema = "Common")]
public class UserManual : BaseEntity
{
    private string _decompressedContent = string.Empty;

    // Foreign Key to UserManualType
    public int UserManualTypeId { get; set; }
    public required UserManualType UserManualType { get; set; }

    public int? MenuId { get; set; } // Foreign Key to Menu (optional if using separate Menu/Submenu)

    // Navigation Properties
    public Menu? Menu { get; set; }

    [MaxLength(200)] public required string Title { get; set; } // Title of the manual
    public required byte[] CompressedContent { get; set; }

    [NotMapped]
    public string Content
    {
        get
        {
            if (string.IsNullOrEmpty(_decompressedContent) && CompressedContent != null)
            {
                var decompressedBytes = CompressionUtils.DecompressGZip(CompressedContent);
                _decompressedContent = Encoding.UTF8.GetString(decompressedBytes);
            }

            return _decompressedContent;
        }
        set
        {
            var stringBytes = Encoding.UTF8.GetBytes(value);
            CompressedContent = CompressionUtils.CompressGZip(stringBytes);
            _decompressedContent = value; // Cache the value
        }
    }

    // Navigation property for tags (Many-to-Many relationship)
    public ICollection<UserManualTag> UserManualTags { get; set; } = [];
}