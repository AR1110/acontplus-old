namespace Identity.Application.Services;

public class LoginHistoryService(IUnitOfWork unitOfWork) : ILoginHistoryService
{
    private IRepository<LoginHistory> repository = unitOfWork.GetRepository<LoginHistory>();

    public async Task AddAsync(LoginHistory loginHistory)
    {
        await repository.AddAsync(loginHistory);
        await unitOfWork.SaveChangesAsync();
    }
}
