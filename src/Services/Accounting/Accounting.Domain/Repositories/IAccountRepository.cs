namespace Accounting.Domain.Repositories;

public interface IAccountRepository
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> AddAsync(Account account);

    Task<SpResponse> UpdateAsync(int id, Account account);
    Task<SpResponse> DeleteAsync(int userId, int id);
}
