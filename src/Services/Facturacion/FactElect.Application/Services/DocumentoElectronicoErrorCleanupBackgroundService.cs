using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace FactElect.Application.Services;

public class DocumentoElectronicoErrorCleanupBackgroundService(IServiceScopeFactory serviceScopeFactory, IConfiguration configuration) : BackgroundService
{
    private readonly TimeSpan _period = TimeSpan.FromHours(configuration.GetValue("ErrorCleanup:Period", 24));

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = serviceScopeFactory.CreateScope();
            var documentoElectronicoErrorService = scope.ServiceProvider.GetRequiredService<IDocumentoElectronicoErrorService>();

            await documentoElectronicoErrorService.CleanupProcessedErrorsAsync();
            await Task.Delay(_period, stoppingToken);
        }
    }
}
