using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Identity.Application.Services;

public class TokenCleanupAndArchivalService(
    IServiceScopeFactory scopeFactory,
    IConfiguration configuration) : BackgroundService
{
    private readonly TimeSpan _checkInterval =
        TimeSpan.FromMinutes(configuration.GetValue("TokenCleanup:CheckInterval", 10));
    private readonly int _batchSize = configuration.GetValue("TokenCleanup:BatchSize", 100);
    private readonly TimeSpan _archiveThreshold = TimeSpan.FromDays(90); // 3 meses

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {

    }
}
