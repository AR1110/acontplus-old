using Microsoft.Extensions.Configuration;
using System.Runtime.InteropServices;

namespace Common.AppSettings;

public static class ConfigurationHelper
{
    public static IConfigurationRoot Load(EnvironmentEnums? env = null)
    {
        var configurationBuilder = new ConfigurationBuilder();
        AddJsonFiles(configurationBuilder, env);

        return configurationBuilder.Build();
    }

    public static void AddJsonFiles(IConfigurationBuilder configurationBuilder, EnvironmentEnums? env = null)
    {
        // Determine environment if not provided
        env ??= EnvironmentHelper.GetEnvironment();

        // Add environment-specific appsettings file
        configurationBuilder.AddJsonFile($"appsettings.{env}.json", optional: true, reloadOnChange: true);

        // Determine shared folder path dynamically based on the OS platform
        string sharedFolder = "";

        if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            // On Windows, use ProgramData or a specific folder based on your application's requirements
            sharedFolder = Path.Combine("C:\\Acontplus\\", "Shared");
        }
        else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
        {
            // On Linux/Ubuntu, use a common folder or specify one as needed (e.g., /var or /home)
            sharedFolder = Path.Combine("/home/acontplus/shared/");
        }
        else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
        {
            // On macOS, use the user's Library/Application Support folder for dynamic path management
            sharedFolder = Path.Combine("/Users/macbookpro/Projects/AcontPlusTeam/AcontPlus/shared");
        }

        // Add shared settings JSON file
        configurationBuilder.AddJsonFile(Path.Combine(sharedFolder, $"sharedsettings.{env}.json"), optional: false, reloadOnChange: true);
    }

}
