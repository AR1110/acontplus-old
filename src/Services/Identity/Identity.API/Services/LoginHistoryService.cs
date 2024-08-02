namespace Identity.API.Services;

public class LoginHistoryService (ApplicationDbContext context): ILoginHistoryService
{
    public async Task AddAsync(LoginHistory loginHistory)
    {
        await context.LoginHistories.AddAsync(loginHistory);
        await context.SaveChangesAsync();
    }
    public async Task CleanExpiredTokensAsync()
    {
        var expiredTokens = await context.LoginHistories
            .Where(lf => lf.TokenExpiration <= DateTime.UtcNow)
            .ToListAsync();

        foreach (var token in expiredTokens)
        {
            token.Token = null;
            token.TokenExpiration = null;
        }

        await context.SaveChangesAsync();
    }
}
