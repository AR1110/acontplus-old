using Common.AppSettings;

namespace Contabilidad.API.Interfaces
{
    public interface IAccountService
    {
        Task<LegacyApiResponse> GetAsync(Dictionary<string, object> parameters);
        Task<LegacyApiResponse> AddAsync(Account account);

        Task<LegacyApiResponse> UpdateAsync(int id, Account account);
        Task<LegacyApiResponse> DeleteAsync(int userId, int id);
        
    }
}
