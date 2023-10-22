using Common.Infrastructure.Repository;
using Identity.API.Interfaces;

namespace Identity.API.Services
{
    public class AccountService : IAccountService
    {
        private readonly IADORepository _repository;
        public AccountService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<string> LoginAppAsync(string username, string password)
        {
            return await _repository.SPExecuteAsync("App.Account_Login", new Dictionary<string, object> {
                { "username", username },
                { "password", password }
            });
        }
        public async Task<string> LoginRestaurantAsync(string username, string password)
        {
            return await _repository.SPExecuteAsync("Seguridad.Login_Restaurant", new Dictionary<string, object> {
                { "username", username },
                { "password", password }
            });
        }
    }
}
