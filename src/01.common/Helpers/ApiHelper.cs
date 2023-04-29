using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Text;

namespace Helpers
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
