namespace Identity.Api.Interfaces;

public interface IAccountService
{
    Task AddNotificationAsync(LoginHistory loginHistory);
    Task<SpResponse> AuthenticateAsync(AccessAuthorization accessAuthorization);
    Task<SpResponse> LoginAsync(string username, string password);
    Task<SpResponse> LoginAppAsync(string username, string password);
    Task<SpResponse> LoginRestaurantAsync(string username, string password);
    Task<SpResponse> RequestAccessAsync(RequestAccessDto accessAuthorization);
}
