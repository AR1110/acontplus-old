using Common.Core.Enums;

namespace Common.Core.Utils;

public static class ConfigHelper
{
    public static IConfigurationRoot Load(Env? env = null)
    {
        var configurationBuilder = new ConfigurationBuilder();
        AddJsonFiles(configurationBuilder, env);

        return configurationBuilder.Build();
    }


    public static void AddJsonFiles(IConfigurationBuilder configurationBuilder, Env? env = null)
    {
        env ??= EnvHelper.GetEnvironment();

        configurationBuilder.AddJsonFile($"appsettings.{env}.json", true, true);
        var sharedFolder = Environment.OSVersion.Platform == PlatformID.Win32NT
            ? Path.Combine("C:\\Acontplus\\", "Shared")
            : Path.Combine("/home/acontplus/shared/");
        configurationBuilder.AddJsonFile(Path.Combine(sharedFolder, $"sharedsettings.{env}.json"), false, true);
    }
}
