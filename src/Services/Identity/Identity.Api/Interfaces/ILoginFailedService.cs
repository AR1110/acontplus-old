namespace Identity.Api.Interfaces;

public interface ILoginFailedService
{
    Task AddAsync(LoginFailed loginFailed);
}