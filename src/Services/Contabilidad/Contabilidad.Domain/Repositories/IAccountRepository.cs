namespace Contabilidad.Domain.Repositories;

public interface IAccountRepository
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> AddAsync(Account account);

    Task<ApiResponse> UpdateAsync(int id, Account account);
    Task<ApiResponse> DeleteAsync(int userId, int id);
}
