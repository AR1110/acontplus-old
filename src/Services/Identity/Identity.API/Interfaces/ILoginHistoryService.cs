namespace Identity.API.Interfaces;

public interface ILoginHistoryService
{
    Task AddAsync(LoginHistory loginHistory);
}