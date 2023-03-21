using Microsoft.Extensions.Configuration;

namespace Helpers
{
    public class ConfigHelper
    {
        public static IConfigurationRoot Load(Env? env = null)
        {
            var configurationBuilder = new ConfigurationBuilder();
            AddJsonFiles(configurationBuilder, env);

            return configurationBuilder.Build();
        }


        public static void AddJsonFiles(IConfigurationBuilder configurationBuilder, Env? env = null)
        {
            if (!env.HasValue)
                env = EnvHelper.GetEnvironment();
            configurationBuilder.AddJsonFile($"appsettings.{env}.json", optional: false, reloadOnChange: true);
            configurationBuilder.AddJsonFile($"00.sharedsettings/sharedsettings.{env}.json", optional: false, reloadOnChange: true);
        }
    }
}