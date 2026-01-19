namespace Identity.Application.Interfaces;

public interface ILoginHistoryService
{
    Task AddAsync(LoginHistory loginHistory);
}