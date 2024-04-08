using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Identity.API.Data;
using Identity.API.Entities;
using Identity.API.Interfaces;
using Microsoft.EntityFrameworkCore;

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
        public async Task AddNotificationAsync(LoginHistory loginHistory)
        {
            try
            {
                var response = await _repository.OnlyExecuteAsync("Seguridad.LoginHistory_Notif_Insert", new Dictionary<string, object> { { "json", DataConverters.SerializeObjectCustom<LoginHistory>(loginHistory) } });
            }
            catch (Exception)
            {

                throw;
            }
        }
        public async Task<ApiResponse> AuthenticateAsync(AccessAuthorization accessAuthorization)
        {
            try
            {
                var query = @"UPDATE Seguridad.AccessAuthorization SET Enabled = 0
                                ,Deleted = 1
                                ,UpdatedAt = GETDATE()
                            WHERE Uuid = @uuid AND code = @code";
                var response = await _repository.OnlyExecuteAsync(query, new Dictionary<string, object> { { "uuid", accessAuthorization.Uuid }, { "code", accessAuthorization.Code } }, false);

                if (response == 0)
                {
                    return new ApiResponse
                    {
                        code = "0",
                        message = "Código no válido"
                    };
                } 
                return new ApiResponse
                {
                    code = "1",
                    message = "Código válido"
                };
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<ApiResponse> LoginAsync(string username, string password)
        {
            return await _repository.SPExecuteAsync("Seguridad.Login_Start", new Dictionary<string, object> {
                { "username", username },
                { "password", password }
            });
        }
        public async Task<string> LoginAppAsync(string username, string password)
        {
            return await _repository.SPExecuteDeprecatedAsync("App.Account_Login", new Dictionary<string, object> {
                { "username", username },
                { "password", password }
            });
        }
        public async Task<string> LoginRestaurantAsync(string username, string password)
        {
            return await _repository.SPExecuteDeprecatedAsync("Seguridad.Login_Restaurant", new Dictionary<string, object> {
                { "username", username },
                { "password", password }
            });
        }
    }
}
