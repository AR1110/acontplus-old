using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text;

namespace HelpersNS20
{
    public static class ApiHelper
    {
        public static string NormalizeBaseUrl(string url)
        {
            return url.EndsWith("/") ? url : url + "/";
        }
        public static string ConvertJsonString(object content)
        {
            if (content == null) { return string.Empty; }
            return JsonConvert.SerializeObject(content, new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });
        }
        public static HttpContent CreateHttpContent(object content)
        {
            string json = ConvertJsonString(content);
            return new StringContent(json, Encoding.UTF8, "application/json");
        }
    }
}
