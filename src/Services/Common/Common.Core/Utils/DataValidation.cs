using System.Text.RegularExpressions;
using System.Xml;
using Newtonsoft.Json.Linq;

namespace Common.Core.Utils;

public static class DataValidation
{
    public static object ToDbNullOrDefault(this object obj)
    {
        return obj ?? DBNull.Value;
    }

    public static bool DataTableIsNull(DataTable dt)
    {
        bool isNull = dt is not { Rows.Count: > 0 };
        return isNull;
    }

    public static bool DataSetIsNull(DataSet ds, bool removeEmptyDt = false)
    {
        switch (removeEmptyDt)
        {
            case true:
                {
                    var tablesToRemove = ds.Tables.Cast<DataTable>().Where(dt => dt.Rows.Count == 0).ToList();

                    foreach (var dt in tablesToRemove)
                    {
                        ds.Tables.Remove(dt);
                    }

                    break;
                }
        }

        return ds == null || ds.Tables.Count == 0;
    }

    public static bool IsXml(string input)
    {
        try
        {
            var xmlDoc = new XmlDocument();
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

    //https://www.techieclues.com/blogs/how-to-check-if-a-string-is-a-valid-json-in-csharp#:~:text=TryParse%20method%20from%20the%20System,that%20the%20string%20is%20valid.
    public static bool IsValidJson(string jsonString)
    {
        try
        {
            JToken.Parse(jsonString);
            return true;
        }
        catch (JsonReaderException)
        {
            return false;
        }
    }
}
