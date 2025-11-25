using System.Text;

namespace Common.Application.DTOs;

public class ReleaseDto
{
    private string _decompressedContent;

    public int Id { get; set; }

    public bool LogoutRequired { get; set; }

    public byte[] CompressedContent { get; set; }

    public string Version { get; set; }

    public string Title { get; set; }

    public string ReleaseDate { get; set; }

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

            return _decompressedContent;
        }
    }
}