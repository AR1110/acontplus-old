using BL.FactElect;
using WS_Validator;

string _env = string.Empty;
#if DEBUG
            _env = "Development";
#else
_env = "Production";
#endif

IHost host = Host.CreateDefaultBuilder(args).
    UseWindowsService(options =>
    {
        options.ServiceName = "WS_Validator";
    })
    .ConfigureServices(services =>
    {
        services.AddSingleton<WebServiceSri>();
        services.AddSingleton<ValidatorService>();
        services.AddHostedService<WindowsBackgroundService>();
    })
    .Build();

await host.RunAsync();
