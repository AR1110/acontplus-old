namespace Identity.API.Services;

public class AccountService(IAdoRepository repository) : IAccountService
{
    public async Task AddNotificationAsync(LoginHistory loginHistory)
    {
        var response = await repository.OnlyExecuteAsync("Seguridad.LoginHistory_Notif_Insert",
            new Dictionary<string, object>
            {
                { "json", DataConverters.SerializeObjectCustom<LoginHistory>(loginHistory) }
            });
    }

    public async Task<ApiResponse> AuthenticateAsync(AccessAuthorization accessAuthorization)
    {
        var query = @"UPDATE Seguridad.AccessAuthorization SET Enabled = 0
                                ,Deleted = 1
                                ,UpdatedAt = GETDATE()
                            WHERE Uuid = @uuid AND code = @code";
        var response = await repository.OnlyExecuteAsync(query,
            new Dictionary<string, object>
            {
                { "uuid", accessAuthorization.Uuid }, { "code", accessAuthorization.Code }
            }, false);

        return response == 0
            ? new ApiResponse { Code = "0", Message = "Código no válido" }
            : new ApiResponse { Code = "1", Message = "Código válido" };
    }

    public async Task<ApiResponse> LoginAsync(string username, string password)
    {
        return await repository.SpExecuteAsync<ApiResponse>("Seguridad.Login_Start",
            new Dictionary<string, object> { { "username", username }, { "password", password } });
    }

    public async Task<ApiResponse> RequestAccessAsync(RequestAccessDto accessAuthorization)
    {
        var response = await repository.OnlyExecuteAsync("Seguridad.AccessAuthorization_Insert",
            new Dictionary<string, object>
            {
                { "uuid", accessAuthorization.Uuid }, 
                { "userRoleId", accessAuthorization.UserRoleId },
                { "fromMobile", accessAuthorization.FromMobile }
            });
        return response == 0
            ? new ApiResponse { Code = "0", Message = "Código no válido" }
            : new ApiResponse { Code = "1", Message = "Código válido" };
    }

    public async Task<ApiResponse> LoginAppAsync(string username, string password)
    {
        return await repository.SpExecuteAsync<ApiResponse>("App.Account_Login",
            new Dictionary<string, object> { { "username", username }, { "password", password } }
        );
    }

    public async Task<string> LoginRestaurantAsync(string username, string password)
    {
        return await repository.SpExecuteDeprecatedAsync("Seguridad.Login_Restaurant",
            new Dictionary<string, object> { { "username", username }, { "password", password } });
    }
}
