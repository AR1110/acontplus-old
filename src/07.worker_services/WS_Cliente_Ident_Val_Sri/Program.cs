namespace WS_Cliente_Ident_Val_Sri
{
    public class Program
    {
        public static void Main(string[] args)
        {
            IHost host = Host.CreateDefaultBuilder(args)
                   .UseWindowsService(options =>
                   {
                       options.ServiceName = "WS_Cliente_Ident_Val_Sri";
                   })
                .ConfigureServices(services =>
                {
                    services.AddTransient<IConfiguration>(config =>
                    {
                        IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
                        configurationBuilder.AddJsonFile($"appsettings.json", optional: false, reloadOnChange: true);
                        return configurationBuilder.Build();

                    });
                    services.AddSingleton<IdentificacionValidacionService>();
                    services.AddHostedService<WindowsBackgroundService>();
                })
                .Build();

            host.Run();
        }
    }
}