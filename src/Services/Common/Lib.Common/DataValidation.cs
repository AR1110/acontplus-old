using System.Data;
using System.Xml;

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
    }
}