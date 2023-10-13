using System.Data;
using System.Text.RegularExpressions;
using System.Xml;
using static System.Net.Mime.MediaTypeNames;

namespace Lib.Common
{
    public static class DataValidation
    {
        public static object ToDBNullOrDefault(this object obj)
        {
            return obj ?? DBNull.Value;
        }
        public static bool DataTableIsNull(DataTable dt)
        {
            bool isNull = true;
            if (dt != null && dt.Rows.Count > 0)
            {
                isNull = false;
            }
            return isNull;
        }
        public static bool IsXml(string input)
        {
            try
            {
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(input);
                return true;
            }
            catch
            {
                return false;
            }
        }
        public static string RemoveSpecialCharacters(string text)
        {
            // Regular expression to match non-alphanumeric characters
            //Regex regex = new Regex("[^a-zA-Z0-9]");
            return Regex.Replace(text, "[^0-9A-Za-z _-]", "");
        }
    }
}
