using BL.Reports;

namespace WS_Notificacion
{
    public class Program
    {
        public static void Main(string[] args)
        {

            string _env = string.Empty;
#if DEBUG
            _env = "Development";
#else
            _env = "Production";
#endif


            IHost host = Host.CreateDefaultBuilder(args)
                .UseWindowsService(options =>
                {
                    options.ServiceName = "WS_Notificacion";
                })
                .ConfigureServices(services =>
                {
                    services.AddTransient<IConfiguration>(config =>
                    {
                        IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
                        configurationBuilder.AddJsonFile($"appsettings.{_env}.json", optional: false, reloadOnChange: true);
                        return configurationBuilder.Build();

                    });
                    services.AddSingleton<Reports>();
                    services.AddSingleton<NotificacionService>();
                    services.AddHostedService<WindowsBackgroundService>();
                })
                .Build();

            host.Run();
        }
    }
}