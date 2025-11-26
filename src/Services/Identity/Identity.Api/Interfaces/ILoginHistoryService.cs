namespace Identity.Api.Interfaces;

public interface ILoginHistoryService
{
    Task AddAsync(LoginHistory loginHistory);
}