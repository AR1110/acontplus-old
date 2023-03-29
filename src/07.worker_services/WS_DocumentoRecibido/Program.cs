using BL.FactElect;

namespace WS_DocumentoRecibido
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
                    options.ServiceName= "WS_Doc_Recibido_Service";
                })
                .ConfigureServices(services =>
                {
                    services.AddTransient<IConfiguration>(config =>
                    {
                        IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
                        configurationBuilder.AddJsonFile($"appsettings.{_env}.json", optional: false, reloadOnChange: true);
                        return configurationBuilder.Build();

                    });
                    services.AddSingleton<WebServiceSri>();
                    services.AddSingleton<DocumentoService>();
                    services.AddHostedService<WindowsBackgroundService>();
                })
                .Build();

            host.Run();
        }
    }
}