using System.Net;
using System.Net.NetworkInformation;

namespace Helpers
{
    public static class HttpCLientHelper
    {
        public static bool IsClientOnline(string address)
        {
            try
            {
                using (var ping = new Ping())
                {
                    var result = ping.Send(address);
                    return result.Status == IPStatus.Success;
                }
            }
            catch (Exception)
            {
                return false;
            }
        }
        public static async Task<bool> HasAccessToEndpoint(string endpointUrl)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    var request = new HttpRequestMessage(HttpMethod.Head, endpointUrl);

                    using (var response = await client.SendAsync(request))
                    {
                        return response.StatusCode == HttpStatusCode.OK;
                    }
                }
            }
            catch
            {
                return false;
            }
        }
    }
}
