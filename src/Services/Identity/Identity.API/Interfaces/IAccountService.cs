namespace Identity.API.Interfaces
{
    public interface IAccountService
    {
        Task<string> LoginAppAsync(string username, string password);
        Task<string> LoginRestaurantAsync(string username, string password);
    }
}
