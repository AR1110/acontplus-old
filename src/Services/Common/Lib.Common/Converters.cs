using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Data;

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
            var options = new JsonSerializerSettings
            {
                ContractResolver = contractResolver,
                Formatting = Formatting.Indented
            };
            string JSONString = JsonConvert.SerializeObject(table, options);
            return JSONString;
        }
        public static object DataSetToJSON(DataSet ds)
        {
            DefaultContractResolver contractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy()
            };
            var options = new JsonSerializerSettings
            {
                ContractResolver = contractResolver,
                Formatting = Formatting.Indented
            };
            return JsonConvert.SerializeObject(ds, new JsonSerializerSettings
            {
                ContractResolver = contractResolver,
                Formatting = Formatting.Indented
            });
        }
        public static DataTable JsonToDataTable(string json)
        {
            DataTable dt = JsonConvert.DeserializeObject(json, (typeof(DataTable))) as DataTable;
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
            DefaultContractResolver contractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy()
            };
            var options = new JsonSerializerSettings
            {
                TypeNameHandling = TypeNameHandling.Auto,
                ContractResolver = contractResolver,
                Formatting = Formatting.Indented
            };
            string json = JsonConvert.SerializeObject(data, options);
            return json;
        }

        //public static string ToCamelCase(this string str)
        //{
        //    //var words = str.Split(new[] { "_", " " }, StringSplitOptions.RemoveEmptyEntries);
        //    //words = words
        //    //    .Select(word => char.ToUpper(word[0]) + word.Substring(1))
        //    //    .ToArray();
        //    //return string.Join(string.Empty, words);
        //    var words = str.Split(new[] { "_", " " }, StringSplitOptions.RemoveEmptyEntries);
        //    var leadWord = Regex.Replace(words[0], @"([A-Z])([A-Z]+|[a-z0-9]+)($|[A-Z]\w*)",
        //        m =>
        //        {
        //            return m.Groups[1].Value.ToLower() + m.Groups[2].Value.ToLower() + m.Groups[3].Value;
        //        });
        //    var tailWords = words.Skip(1)
        //        .Select(word => char.ToUpper(word[0]) + word.Substring(1))
        //        .ToArray();
        //    return $"{leadWord}{string.Join(string.Empty, tailWords)}";
        //}
    }
}