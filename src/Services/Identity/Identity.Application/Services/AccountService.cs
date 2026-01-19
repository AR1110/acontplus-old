namespace Identity.Application.Services;

public class AccountService(IAdoRepository repository) : IAccountService
{
    public async Task AddNotificationAsync(LoginHistory loginHistory)
    {
        var response = await repository.ExecuteNonQueryAsync("Seguridad.LoginHistory_Notif_Insert",
            new Dictionary<string, object>
            {
                { "json", DataConverters.SerializeObjectCustom<LoginHistory>(loginHistory) }
            });
    }

    public async Task<SpResponse> AuthenticateAsync(AccessAuthorization accessAuthorization)
    {
        var query = @"UPDATE Seguridad.AccessAuthorization SET IsActive = CAST(0 AS BIT)
                                ,IsDeleted = CAST(1 AS BIT)
                                ,UpdatedAt = GETUTCDATE()
                            WHERE Uuid = @uuid AND code = @code";

        var commandOptions = new CommandOptionsDto
        {
            CommandTimeout = 0,
            CommandType = CommandType.Text
        };
        var response = await repository.ExecuteNonQueryAsync(query,
            new Dictionary<string, object>
            {
                { "uuid", accessAuthorization.Uuid }, { "code", accessAuthorization.Code }
            }, commandOptions);

        return response == 0
            ? new SpResponse { Code = "0", Message = "Código no válido" }
            : new SpResponse { Code = "1", Message = "Código válido" };
    }

    public async Task<SpResponse> LoginAsync(string username, string password)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>("Seguridad.Login_Start",
            new Dictionary<string, object> { { "username", username }, { "password", password } });
    }

    public async Task<SpResponse> RequestAccessAsync(RequestAccessDto accessAuthorization)
    {
        var response = await repository.ExecuteNonQueryAsync("Seguridad.AccessAuthorization_Insert",
            new Dictionary<string, object>
            {
                { "uuid", accessAuthorization.Uuid },
                { "userRoleId", accessAuthorization.UserRoleId },
                { "fromMobile", accessAuthorization.FromMobile }
            });
        return response == 0
            ? new SpResponse { Code = "0", Message = "Código no válido" }
            : new SpResponse { Code = "1", Message = "Código válido" };
    }

    public async Task<SpResponse> LoginAppAsync(string username, string password)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>("App.Account_Login",
            new Dictionary<string, object> { { "username", username }, { "password", password } }
        );
    }

    public async Task<SpResponse> LoginRestaurantAsync(string username, string password)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>("Seguridad.Login_Restaurant",
            new Dictionary<string, object> { { "username", username }, { "password", password } });
    }
}
