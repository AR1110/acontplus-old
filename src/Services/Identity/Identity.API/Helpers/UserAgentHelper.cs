namespace Identity.API.Helpers;

public static class UserAgentHelper
{
    public static UserAgentContainer SummarizeUserAgent(string userAgentJson)
    {
        if (string.IsNullOrEmpty(userAgentJson))
            return new UserAgentContainer { UserAgent = "Invalid UserAgent", IpAddress = "" };

        try
        {
            var userAgentMain = JsonConvert.DeserializeObject<UserAgentContainer>(userAgentJson);
            var userAgent = JsonConvert.DeserializeObject<UserAgentSummary>(userAgentMain.UserAgent);
            if (userAgent == null || string.IsNullOrEmpty(userAgent.Browser.Name) ||
                string.IsNullOrEmpty(userAgent.Browser.Version) ||
                string.IsNullOrEmpty(userAgent.Os.Name) ||
                string.IsNullOrEmpty(userAgent.Os.Version))
                return new UserAgentContainer { UserAgent = "Incomplete UserAgent data", IpAddress = "" };
            var summarizedUserAgent = new
            {
                application = "acontplus-web",
                browser = $"{userAgent.Browser.Name} {userAgent.Browser.Version}",
                os = $"{userAgent.Os.Name} {userAgent.Os.Version}"
            };

            return new UserAgentContainer
            {
                UserAgent = JsonConvert.SerializeObject(summarizedUserAgent),
                IpAddress = userAgentMain.IpAddress
            };
        }
        catch (JsonException)
        {
            return new UserAgentContainer { UserAgent = "Invalid UserAgent format", IpAddress = "" };
        }
    }
}

public class UserAgentContainer
{
    public string UserAgent { get; set; }
    public string IpAddress { get; set; }
}

public class UserAgentSummary
{
    public string Ua { get; set; }
    public BrowserInfo Browser { get; set; }
    public EngineInfo Engine { get; set; }
    public OsInfo Os { get; set; }
    public DeviceInfo Device { get; set; }
    public CpuInfo Cpu { get; set; }
}

public abstract class BrowserInfo
{
    public string Name { get; set; }
    public string Version { get; set; }
    public string Major { get; set; }
}

public abstract class EngineInfo
{
    public string Name { get; set; }
    public string Version { get; set; }
}

public abstract class OsInfo
{
    public string Name { get; set; }
    public string Version { get; set; }
}

public abstract class DeviceInfo
{
    // Define properties if needed
}

public abstract class CpuInfo
{
    public string Architecture { get; set; }
}