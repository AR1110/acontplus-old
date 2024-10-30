using Microsoft.Extensions.Configuration;

namespace Identity.API.Services;

public class TokenCleanupService(IServiceScopeFactory scopeFactory, IConfiguration configuration) : BackgroundService
{
    private readonly TimeSpan _checkInterval =
        TimeSpan.FromMinutes(configuration.GetValue<int>("TokenCleanup:CheckInterval", 8));

    private readonly int _topExpiredTokens = configuration.GetValue<int>("TokenCleanup:TopExpiredTokens", 50);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                var expiredTokens = await context.LoginHistories
                    .Where(x => !string.IsNullOrEmpty(x.Token) &&
                                (!x.TokenExpiration.HasValue || x.TokenExpiration <= DateTime.UtcNow))
                    .OrderBy(x => x.LoginDate)
                    .Take(_topExpiredTokens)
                    .ToListAsync(cancellationToken: stoppingToken);

                if (expiredTokens.Count != 0)
                {
                    foreach (var token in expiredTokens)
                    {
                        token.Token = null;
                        token.TokenExpiration = null;
                    }

                    await context.SaveChangesAsync(stoppingToken);
                }
            }

            await Task.Delay(_checkInterval, stoppingToken);
        }
    }
}
