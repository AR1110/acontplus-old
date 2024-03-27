using Azure;
using Common.Core.Interfaces;
using Common.Core.Models;
using Identity.API.Data;
using Identity.API.Interfaces;

namespace Identity.API.Services
{
    public class AccountService : IAccountService
    {
        private readonly IADORepository _repository;
        private readonly ApplicationDbContext _context;

        public AccountService(IADORepository repository, ApplicationDbContext context)
        {
            _repository = repository;
            _context = context;
        }
        public async Task<string> LoginAsync(string username, string password)
        {
            return await _repository.SPExecuteAsync("Seguridad.Login_Start", new Dictionary<string, object> {
                { "username", username },
                { "password", password }
            });
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

        public async Task<ApiResponse> VerifyCodeAsync(int code)
        {
            try
            {
                var response = await _context.AccessAuthorizations.FindAsync(code);

                if (response == null)
                {
                    return new ApiResponse
                    {
                        code = "0",
                        message = "Código no válido"
                    };
                }
                else
                {
                    return new ApiResponse
                    {
                        code = "1",
                        message = "Código válido",
                        payload = response
                    };
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
