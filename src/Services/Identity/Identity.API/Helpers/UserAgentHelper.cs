namespace Identity.API.Helpers
{
    public static class UserAgentHelper
    {
        public static UserAgentContainer SummarizeUserAgent(string userAgentJson)
        {
            if (string.IsNullOrEmpty(userAgentJson))
            {
                return new UserAgentContainer { userAgent = "Invalid UserAgent", ipAddress = "" };
            }

            try
            {
                var userAgentMain = JsonConvert.DeserializeObject<UserAgentContainer>(userAgentJson);
                var userAgent = JsonConvert.DeserializeObject<UserAgentSummary>(userAgentMain.userAgent);
                if (userAgent == null || string.IsNullOrEmpty(userAgent.browser.name) ||
                    string.IsNullOrEmpty(userAgent.browser.version) ||
                    string.IsNullOrEmpty(userAgent.os.name) ||
                    string.IsNullOrEmpty(userAgent.os.version))
                {
                    return new UserAgentContainer { userAgent = "Incomplete UserAgent data", ipAddress = "" };
                }
                var summarizedUserAgent = new
                {
                    application = "acontplus-web",
                    browser = $"{userAgent.browser.name} {userAgent.browser.version}",
                    os = $"{userAgent.os.name} {userAgent.os.version}"
                };

                return new UserAgentContainer
                {
                    userAgent = JsonConvert.SerializeObject(summarizedUserAgent),
                    ipAddress = userAgentMain.ipAddress
                };
            }
            catch (JsonException)
            {
                return new UserAgentContainer { userAgent = "Invalid UserAgent format", ipAddress = "" };
            }
        }
    }

    public class UserAgentContainer
    {
        public string userAgent { get; set; }
        public string ipAddress { get; set; }
    }

    public class UserAgentSummary
    {
        public string ua { get; set; }
        public BrowserInfo browser { get; set; }
        public EngineInfo engine { get; set; }
        public OsInfo os { get; set; }
        public DeviceInfo device { get; set; }
        public CpuInfo cpu { get; set; }
    }

    public class BrowserInfo
    {
        public string name { get; set; }
        public string version { get; set; }
        public string major { get; set; }
    }

    public class EngineInfo
    {
        public string name { get; set; }
        public string version { get; set; }
    }

    public class OsInfo
    {
        public string name { get; set; }
        public string version { get; set; }
    }

    public class DeviceInfo
    {
        // Define properties if needed
    }

    public class CpuInfo
    {
        public string architecture { get; set; }
    }

}
