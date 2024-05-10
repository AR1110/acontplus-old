namespace Identity.API.Interfaces;

public interface IAccountService
{
    Task AddNotificationAsync(LoginHistory loginHistory);
    Task<ApiResponse> AuthenticateAsync(AccessAuthorization accessAuthorization);
    Task<ApiResponse> LoginAsync(string username, string password);
    Task<string> LoginAppAsync(string username, string password);
    Task<string> LoginRestaurantAsync(string username, string password);
    Task<ApiResponse> RequestAccessAsync(RequestAccessDto accessAuthorization);
}
