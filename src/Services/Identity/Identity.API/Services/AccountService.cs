namespace Identity.API.Services;

public class AccountService : IAccountService
{
    private readonly ApplicationDbContext _context;
    private readonly IAdoRepository _repository;

    public AccountService(IAdoRepository repository, ApplicationDbContext context)
    {
        _repository = repository;
        _context = context;
    }

    public async Task AddNotificationAsync(LoginHistory loginHistory)
    {
        var response = await _repository.OnlyExecuteAsync("Seguridad.LoginHistory_Notif_Insert",
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
        var response = await _repository.OnlyExecuteAsync(query,
            new Dictionary<string, object>
            {
                { "uuid", accessAuthorization.Uuid }, { "code", accessAuthorization.Code }
            }, false);

        if (response == 0)
        {
            return new ApiResponse { Code = "0", Message = "Código no válido" };
        }

        return new ApiResponse { Code = "1", Message = "Código válido" };
    }

    public async Task<ApiResponse> LoginAsync(string username, string password)
    {
        return await _repository.SpExecuteAsync<ApiResponse>("Seguridad.Login_Start",
            new Dictionary<string, object> { { "username", username }, { "password", password } });
    }

    public async Task<ApiResponse> RequestAccessAsync(RequestAccessDto accessAuthorization)
    {
        var response = await _repository.OnlyExecuteAsync("Seguridad.AccessAuthorization_Insert",
            new Dictionary<string, object>
            {
                { "uuid", accessAuthorization.Uuid }, { "userRoleId", accessAuthorization.UserRoleId }
            });
        if (response == 0)
        {
            return new ApiResponse { Code = "0", Message = "Código no válido" };
        }

        return new ApiResponse { Code = "1", Message = "Código válido" };
    }

    public async Task<string> LoginAppAsync(string username, string password)
    {
        return await _repository.SpExecuteDeprecatedAsync("App.Account_Login",
            new Dictionary<string, object> { { "username", username }, { "password", password } });
    }

    public async Task<string> LoginRestaurantAsync(string username, string password)
    {
        return await _repository.SpExecuteDeprecatedAsync("Seguridad.Login_Restaurant",
            new Dictionary<string, object> { { "username", username }, { "password", password } });
    }
}
