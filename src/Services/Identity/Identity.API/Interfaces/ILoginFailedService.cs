namespace Identity.API.Interfaces;

public interface ILoginFailedService
{
    Task AddAsync(LoginFailed loginFailed);
}