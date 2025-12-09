namespace Identity.Api.Services;

public class LoginHistoryService(ApplicationDbContext context) : ILoginHistoryService
{
    public async Task AddAsync(LoginHistory loginHistory)
    {
        //await context.LoginHistories.AddAsync(loginHistory);
        //await context.SaveChangesAsync();
    }
}
