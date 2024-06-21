using System.Collections;
using Newtonsoft.Json.Serialization;

namespace Common.Core.Utils;

public static class DataConverters
{
    public static string DataTableToJson(DataTable table)
    {
        var contractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
        var options = new JsonSerializerSettings
        {
            ContractResolver = contractResolver,
            Formatting = Formatting.Indented
        };
        return JsonConvert.SerializeObject(table, options);
    }

    public static object DataSetToJson(DataSet ds, bool oldConverter = false)
    {
        if (oldConverter)
        {
            var root = new ArrayList();

            foreach (DataTable dt in ds.Tables)
            {
                var table = (from DataRow dr in dt.Rows
                             select dt.Columns.Cast<DataColumn>().ToDictionary(col => col.ColumnName, col => dr[col])).ToList();

                root.Add(table);
            }

            return JsonConvert.SerializeObject(root);
        }

        var contractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
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
        return JsonConvert.SerializeObject(data,
            new JsonSerializerSettings
            {
                ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() },
                Formatting = Formatting.Indented
            });
    }

    public static string DictionaryToString<TKey, TValue>(IDictionary<TKey, TValue> dictionary)
    {
        return "{" + string.Join(", ", dictionary.Select(kvp => kvp.Key + "=" + kvp.Value).ToArray()) + "}";
    }

    public static string SerializeObjectCustom<T>(object data)
    {
        var contractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
        var options = new JsonSerializerSettings
        {
            ContractResolver = contractResolver,
            Formatting = Formatting.Indented
        };
        return JsonConvert.SerializeObject(data, options);
    }
}
