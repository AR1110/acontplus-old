using Common.Core.Enums;
using Microsoft.Extensions.Configuration;

namespace Common.Core.Utils
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
            configurationBuilder.AddJsonFile($"appsettings.{env}.json", optional: true, reloadOnChange: true);
            configurationBuilder.AddJsonFile($"SharedSettings/sharedsettings.{env}.json", optional: true, reloadOnChange: true);
        }
    }
}
