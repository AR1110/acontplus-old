using System.Collections;
using System.Data;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Unicode;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Lib.Common
{
    public static class Converters
    {
        public static string DataTableToJSON(DataTable table)
        {
            DefaultContractResolver contractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy()
            };
            string JSONString = JsonConvert.SerializeObject(table, new JsonSerializerSettings
            {
                ContractResolver = contractResolver,
                Formatting = Formatting.Indented
            });
            return JSONString;
        }
        public static object DataSetToJSON(DataSet ds)
        {
            ArrayList root = new ArrayList();
            List<Dictionary<string, object>> table;
            Dictionary<string, object> data;

            foreach (DataTable dt in ds.Tables)
            {
                table = new List<Dictionary<string, object>>();
                foreach (DataRow dr in dt.Rows)
                {
                    data = new Dictionary<string, object>();
                    foreach (DataColumn col in dt.Columns)
                    {
                        data.Add(col.ColumnName, dr[col]);
                    }
                    table.Add(data);
                }
                root.Add(table);
            }

            return JsonConvert.SerializeObject(root);
        }
        public static DataTable JsonToDataTable(string json)
        {
            DataTable dt = JsonConvert.DeserializeObject(json, (typeof(DataTable))) as DataTable;
            return dt;
        }
        public static string SerializeDictionary(Dictionary<string, object> data)
        {
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.Create(UnicodeRanges.BasicLatin, UnicodeRanges.Cyrillic),
                WriteIndented = true // Optional: makes the output formatted for readability
            };
            var result = System.Text.Json.JsonSerializer.Serialize(data, options);
            return result;
        }
    }
}