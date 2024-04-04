using System.Collections;
using System.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Common.Core.Utils
{
    public static class DataConverters
    {
        public static string DataTableToJSON(DataTable table)
        {
            var contractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy()
            };
            var options = new JsonSerializerSettings
            {
                ContractResolver = contractResolver,
                Formatting = Formatting.Indented
            };
            var JSONString = JsonConvert.SerializeObject(table, options);
            return JSONString;
        }
        public static object DataSetToJSON(DataSet ds, bool oldConverter = false)
        {
            if (oldConverter)
            {
                var root = new ArrayList();
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
            var contractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy()
            };
            var options = new JsonSerializerSettings
            {
                ContractResolver = contractResolver,
                Formatting = Formatting.Indented
            };
            return JsonConvert.SerializeObject(ds, options);
        }
        public static DataTable JsonToDataTable(string json)
        {
            var dt = JsonConvert.DeserializeObject(json, typeof(DataTable)) as DataTable;
            return dt;
        }
        public static string SerializeDictionary(Dictionary<string, object> data)
        {
            //var options = new JsonSerializerOptions
            //{
            //    Encoder = JavaScriptEncoder.Create(UnicodeRanges.BasicLatin, UnicodeRanges.Cyrillic),
            //    WriteIndented = true // Optional: makes the output formatted for readability
            //};
            //var result = System.Text.Json.JsonSerializer.Serialize(data, options);
            var contractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy()
            };
            var options = new JsonSerializerSettings
            {
                TypeNameHandling = TypeNameHandling.Auto,
                ContractResolver = contractResolver,
                Formatting = Formatting.Indented
            };
            var json = JsonConvert.SerializeObject(data, options);
            return json;
        }
        public static string DictionaryToString<TKey, TValue>(IDictionary<TKey, TValue> dictionary)
        {
            return "{" + string.Join(", ", dictionary.Select(kvp => kvp.Key + "=" + kvp.Value).ToArray()) + "}";
        }
        public static string SerializeObjectCustom<T>(object data)
        {
            var contractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy()
            };
            var options = new JsonSerializerSettings
            {
                ContractResolver = contractResolver,
                Formatting = Formatting.Indented
            };
            var JSONString = JsonConvert.SerializeObject(data, options);
            return JSONString;
        }
    }
}
