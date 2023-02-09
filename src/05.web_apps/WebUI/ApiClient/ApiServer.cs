using Helpers;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http.Headers;

namespace WebUI.ApiClient
{
    public class ApiServer
    {
        private readonly TimeSpan _timeout;
        private HttpClient _httpClient;
        private HttpClientHandler _httpClientHandler;
        private readonly string _baseUrl;
        private const string ClientUserAgent = "acontplus-api-client-v3";
        public ApiServer(string baseUrl, TimeSpan? timeout = null)
        {
            _baseUrl = ApiHelper.NormalizeBaseUrl(baseUrl);
            _timeout = timeout ?? TimeSpan.FromSeconds(90);
        }
        public async Task<T> GetAsync<T>(string url)
        {
            EnsureHttpClientCreated();
            _httpClient.DefaultRequestHeaders.Authorization = null;
            HttpResponseMessage response = await _httpClient.GetAsync(url);
            var data = JsonConvert.DeserializeObject<T>(await response.Content.ReadAsStringAsync());
            return data;
        }
        public async Task PostAsync(string url, object content)
        {
            var response = await _httpClient.PostAsync(url, ApiHelper.CreateHttpContent(content));

            response.EnsureSuccessStatusCode();
        }
        public async Task<T> PostAsync<T>(string url, object content)
        {
            EnsureHttpClientCreated();
            _httpClient.DefaultRequestHeaders.Authorization = null;
            HttpResponseMessage response = await _httpClient.PostAsync(url, ApiHelper.CreateHttpContent(content));
            var data = JsonConvert.DeserializeObject<T>(await response.Content.ReadAsStringAsync());
            return data;
        }
        public async Task<HttpResponseMessage> DeleteAsync(string url, string id)
        {
            try
            {
                EnsureHttpClientCreated();
                return await _httpClient.DeleteAsync(new Uri(string.Format("{0}/{1}", url, id)));
            }
            catch (Exception ex)
            {
                ex.Message.ToString();
                return null;
            }
        }
        private void CreateHttpClient()
        {
            _httpClientHandler = new HttpClientHandler
            {
                AutomaticDecompression = DecompressionMethods.Deflate | DecompressionMethods.GZip
            };

            _httpClient = new HttpClient(_httpClientHandler, false)
            {
                Timeout = _timeout
            };

            _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd(ClientUserAgent);

            if (!string.IsNullOrWhiteSpace(_baseUrl))
            {
                _httpClient.BaseAddress = new Uri(_baseUrl);
            }

            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }
        private void EnsureHttpClientCreated()
        {
            if (_httpClient == null)
            {
                CreateHttpClient();
            }
        }
        public void Dispose()
        {
            _httpClientHandler?.Dispose();
            _httpClient?.Dispose();
        }
    }
}
