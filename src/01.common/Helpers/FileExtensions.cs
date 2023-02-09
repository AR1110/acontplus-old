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
    }
}
