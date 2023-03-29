using System.Text.RegularExpressions;
namespace Helpers
{
    public static class FileExtensions
    {
        public static string SanitizeFileName(string fileName)
        {
            string response = Regex.Replace(fileName.Trim(), "[^A-Za-z0-9_. ]+", "");
            return response.Replace(" ", string.Empty);
        }
        public static string GetBase64FromByte(byte[] valueByte)
        {
            string base64String = Convert.ToBase64String(valueByte, 0, valueByte.Length);
            return base64String;
        }
    }
}
