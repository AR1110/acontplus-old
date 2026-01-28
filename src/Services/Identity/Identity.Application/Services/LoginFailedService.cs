namespace Identity.Application.Services;

public class LoginFailedService(IUnitOfWork unitOfWork) : ILoginFailedService
{
    private IRepository<LoginFailed> repository = unitOfWork.GetRepository<LoginFailed>();
    public async Task AddAsync(LoginFailed loginFailed)
    {
        await repository.AddAsync(loginFailed);
        await unitOfWork.SaveChangesAsync();
    }
}
