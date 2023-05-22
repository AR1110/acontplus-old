using BL.FactElect;
using WS_Authorizer;
string _env = string.Empty;
#if DEBUG
_env = "Development";
#else
    _env = "Production";
#endif

IHost host = Host.CreateDefaultBuilder(args)
    .UseWindowsService(options =>
    {
        options.ServiceName = "WS_Authorizer";
    })
    .ConfigureServices(services =>
     {
         services.AddSingleton<WebServiceSri>();
         services.AddSingleton<AuthorizerService>();
         services.AddHostedService<WindowsBackgroundService>();
     })
    .Build();

await host.RunAsync();
