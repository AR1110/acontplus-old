namespace Identity.Api.Services;

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
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var archiveBeforeDate = DateTime.UtcNow.Subtract(_archiveThreshold);

            // 1.ARCHIVAR REGISTROS ANTIGUOS
            var oldRecords = await db.LoginHistories
                .Where(x => x.CreatedAt < archiveBeforeDate)
                .OrderBy(x => x.CreatedAt)
                .Take(_batchSize)
                .ToListAsync(stoppingToken);

            if (oldRecords.Count != 0)
            {
                var archived = oldRecords.Select(x => new LoginHistoryArchive
                {
                    CreatedByUserId = x.CreatedByUserId,
                    UserRoleId = x.UserRoleId,
                    UserAgent = x.UserAgent,
                    IpAddress = x.IpAddress,
                    Token = x.Token,
                    TokenExpiration = x.TokenExpiration,
                    CreatedAt = x.CreatedAt,
                    Id = 0,
                }).ToList();

                db.LoginHistoryArchives.AddRange(archived);
                db.LoginHistories.RemoveRange(oldRecords);
                await db.SaveChangesAsync(stoppingToken);
            }

            // 2.LIMPIAR TOKENS EXPIRADOS(de los últimos 3 meses)
            var tokensToClean = await db.LoginHistories
                .Where(x =>
                    x.CreatedAt >= archiveBeforeDate &&
                    !string.IsNullOrEmpty(x.Token) &&
                    (!x.TokenExpiration.HasValue || x.TokenExpiration <= DateTime.UtcNow))
                .OrderBy(x => x.CreatedAt)
                .Take(_batchSize)
                .ToListAsync(stoppingToken);

            if (tokensToClean.Count != 0)
            {
                foreach (var token in tokensToClean)
                {
                    token.IsLoggedIn = null;
                    token.IsLocked = null;
                    token.IsActive = false;
                    token.Token = null;
                    token.TokenExpiration = null;
                }

                await db.SaveChangesAsync(stoppingToken);
            }

            //3.LIMPIAR REGISTROS DE LOGIN FALLIDO(más de 3 meses)
            var expired = await db.LoginFaileds
                .Where(x => x.CreatedAt < DateTime.UtcNow.AddMonths(-3))
                .OrderBy(x => x.CreatedAt)
                .Take(_batchSize)
                .ToListAsync(stoppingToken);

            if (expired.Count > 0)
            {
                db.LoginFaileds.RemoveRange(expired);
                await db.SaveChangesAsync(stoppingToken);
            }

            await Task.Delay(_checkInterval, stoppingToken);
        }
    }
}
