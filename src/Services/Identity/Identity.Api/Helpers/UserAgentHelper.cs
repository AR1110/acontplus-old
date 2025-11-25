namespace Identity.Api.Helpers;

public static class UserAgentHelper
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public static UserAgentContainer SummarizeUserAgent(string userAgentJson)
    {
        if (string.IsNullOrWhiteSpace(userAgentJson))
        {
            return CreateFallbackContainer("Empty or null UserAgent");
        }

        try
        {
            // First, try to deserialize as UserAgentContainer
            var userAgentContainer = JsonSerializer.Deserialize<UserAgentContainer>(userAgentJson, JsonOptions);

            if (userAgentContainer?.UserAgent == null)
            {
                return CreateFallbackContainer("Invalid UserAgent container structure");
            }

            UserAgentSummary userAgentSummary;

            // Check if UserAgent is already a string (processed) or needs parsing
            if (IsJsonString(userAgentContainer.UserAgent))
            {
                userAgentSummary = JsonSerializer.Deserialize<UserAgentSummary>(userAgentContainer.UserAgent, JsonOptions);
            }
            else
            {
                // UserAgent is already a processed string, return as-is
                return new UserAgentContainer
                {
                    UserAgent = userAgentContainer.UserAgent,
                    IpAddress = userAgentContainer.IpAddress ?? string.Empty
                };
            }

            return userAgentSummary == null
                ? CreateFallbackContainer("Failed to parse UserAgent summary", userAgentContainer.IpAddress)
                : ProcessUserAgentSummary(userAgentSummary, userAgentContainer.IpAddress);
        }
        catch (JsonException ex)
        {
            // Log the exception if you have logging configured
            // _logger?.LogWarning(ex, "Failed to parse UserAgent JSON: {UserAgentJson}", userAgentJson);
            return CreateFallbackContainer($"JSON parsing error: {ex.Message}");
        }
        catch (Exception ex)
        {
            // Handle any other unexpected exceptions
            // _logger?.LogError(ex, "Unexpected error processing UserAgent: {UserAgentJson}", userAgentJson);
            return CreateFallbackContainer($"Unexpected error: {ex.Message}");
        }
    }

    private static UserAgentContainer ProcessUserAgentSummary(UserAgentSummary userAgent, string ipAddress)
    {
        // Extract browser information with fallbacks
        var browserName = GetSafeValue(userAgent.Browser?.Name, "Unknown Browser");
        var browserVersion = GetSafeValue(userAgent.Browser?.Version, "Unknown Version");

        // Extract OS information with fallbacks
        var osName = GetSafeValue(userAgent.Os?.Name, "Unknown OS");
        var osVersion = GetSafeValue(userAgent.Os?.Version, "Unknown Version");

        // Check if we have minimal required information
        if (browserName == "Unknown Browser" && osName == "Unknown OS")
        {
            return CreateFallbackContainer("Incomplete UserAgent data - missing browser and OS info", ipAddress);
        }

        var summarizedUserAgent = new
        {
            application = "acontplus-web",
            browser = $"{browserName} {browserVersion}".Trim(),
            os = $"{osName} {osVersion}".Trim(),
            device = GetDeviceInfo(userAgent.Device),
            engine = GetEngineInfo(userAgent.Engine),
            cpu = GetCpuInfo(userAgent.Cpu)
        };

        return new UserAgentContainer
        {
            UserAgent = JsonSerializer.Serialize(summarizedUserAgent, JsonOptions),
            IpAddress = ipAddress ?? string.Empty
        };
    }

    private static string GetDeviceInfo(DeviceInfo device)
    {
        if (device == null) return "Unknown Device";

        var deviceParts = new List<string>();

        if (!string.IsNullOrWhiteSpace(device.Vendor))
            deviceParts.Add(device.Vendor);
        if (!string.IsNullOrWhiteSpace(device.Model))
            deviceParts.Add(device.Model);
        if (!string.IsNullOrWhiteSpace(device.Type))
            deviceParts.Add($"({device.Type})");

        return deviceParts.Count > 0 ? string.Join(" ", deviceParts) : "Unknown Device";
    }

    private static string GetEngineInfo(EngineInfo engine)
    {
        if (engine == null) return "Unknown Engine";

        var engineName = GetSafeValue(engine.Name, "Unknown");
        var engineVersion = GetSafeValue(engine.Version, "");

        return string.IsNullOrWhiteSpace(engineVersion) ? engineName : $"{engineName} {engineVersion}";
    }

    private static string GetCpuInfo(CpuInfo cpu)
    {
        return cpu?.Architecture ?? "Unknown Architecture";
    }

    private static string GetSafeValue(string value, string fallback)
    {
        return string.IsNullOrWhiteSpace(value) ? fallback : value.Trim();
    }

    private static bool IsJsonString(string str)
    {
        if (string.IsNullOrWhiteSpace(str)) return false;
        str = str.Trim();
        return (str.StartsWith("{") && str.EndsWith("}")) || (str.StartsWith("[") && str.EndsWith("]"));
    }

    private static UserAgentContainer CreateFallbackContainer(string reason, string ipAddress = "")
    {
        return new UserAgentContainer
        {
            UserAgent = reason,
            IpAddress = ipAddress ?? string.Empty
        };
    }
}

public class UserAgentContainer
{
    public string UserAgent { get; set; }
    public string IpAddress { get; set; }
}

public class UserAgentSummary
{
    public string? Ua { get; set; }
    public BrowserInfo? Browser { get; set; }
    public EngineInfo? Engine { get; set; }
    public OsInfo? Os { get; set; }
    public DeviceInfo? Device { get; set; }
    public CpuInfo? Cpu { get; set; }
}

public class BrowserInfo
{
    public string? Name { get; set; }
    public string? Version { get; set; }
    public string? Major { get; set; }
}

public class EngineInfo
{
    public string? Name { get; set; }
    public string? Version { get; set; }
}

public class OsInfo
{
    public string? Name { get; set; }
    public string? Version { get; set; }
}

public class DeviceInfo
{
    public string? Vendor { get; set; }
    public string? Model { get; set; }
    public string? Type { get; set; }
}

public class CpuInfo
{
    public string? Architecture { get; set; }
}
