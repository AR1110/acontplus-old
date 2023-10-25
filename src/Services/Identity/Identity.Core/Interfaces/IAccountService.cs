namespace Identity.Core.Interfaces
{
    public interface IAccountService
    {
        Task<string> LoginAsync(string username, string password);
        Task<string> LoginAppAsync(string username, string password);
        Task<string> LoginRestaurantAsync(string username, string password);
    }
}
