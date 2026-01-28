namespace Identity.Application.Interfaces;

public interface ILoginFailedService
{
    Task AddAsync(LoginFailed loginFailed);
}