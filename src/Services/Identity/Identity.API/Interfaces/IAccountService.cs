namespace Identity.API.Interfaces
{
    public interface IAccountService
    {
        Task<string> LoginRestaurantAsync(string username, string password);
    }
}
