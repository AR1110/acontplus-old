using Common.Infrastructure.Repository;
using Identity.API.Interfaces;
using Lib.Common;

namespace Identity.API.Services
{
    public class AccountService : IAccountService
    {
        private readonly IADORepository _repository;
        public AccountService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<string> LoginRestaurantAsync(string username, string password)
        {
            return await _repository.SPExecuteAsync("ApplicationDbContext", "Seguridad.Login_Restaurant", new Dictionary<string, object> {
                { "username", username },
                { "password", password }
            });
        }
    }
}
