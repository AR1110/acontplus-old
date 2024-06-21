using Common.Core.Utils;
using Microsoft.AspNetCore.Http;

namespace Common.Core.Models;

public class FileModel
{
    public string FileName { get; set; }
    public string ContentType { get; set; }
    public byte[] Content { get; set; }
    public string Base64 { get; set; }

    public void CreateBase64(byte[] content, string contentType, string fileName = null)
    {
        Content = content;
        ContentType = contentType;
        FileName = fileName;
        Base64 = Convert.ToBase64String(content, 0, content.Length);
    }

    public void CreateBytesCompressed(IFormFile file)
    {
        Content = CompressionHelper.Compress(FileExtensions.GetBytes(file));
        ContentType = file.ContentType;
        FileName = FileExtensions.SanitizeFileName(file.FileName);
    }
}
