namespace Identity.API.Services;

public class TokenCleanupService(IServiceProvider serviceProvider) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await CleanExpiredTokens();
            await Task.Delay(TimeSpan.FromHours(1), stoppingToken); // Run every hour
        }
    }

    private async Task CleanExpiredTokens()
    {
        using var scope = serviceProvider.CreateScope();
        var loginHistoryService = scope.ServiceProvider.GetRequiredService<ILoginHistoryService>();
        await loginHistoryService.CleanExpiredTokensAsync();
    }
}
