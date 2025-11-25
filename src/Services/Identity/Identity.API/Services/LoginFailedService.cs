namespace Identity.Api.Services;

public class LoginFailedService(ApplicationDbContext context) : ILoginFailedService
{
    public async Task AddAsync(LoginFailed loginFailed)
    {
        await context.LoginFaileds.AddAsync(loginFailed);
        await context.SaveChangesAsync();
    }
}
