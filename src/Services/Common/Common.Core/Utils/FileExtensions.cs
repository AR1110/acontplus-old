using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;

namespace Common.Core.Utils;

public static class FileExtensions
{
    public static string SanitizeFileName(string fileName)
    {
        var response = Regex.Replace(fileName.Trim(), "[^A-Za-z0-9_. ]+", "");
        return response.Replace(" ", string.Empty);
    }

    public static string GetBase64FromByte(byte[] valueByte)
    {
        var base64String = Convert.ToBase64String(valueByte, 0, valueByte.Length);
        return base64String;
    }

    public static byte[] GetBytes(IFormFile file)
    {
        byte[] fileBytes = null;
        using var ms = new MemoryStream();
        file.CopyTo(ms);
        fileBytes = ms.ToArray();
        return fileBytes;
    }
}
