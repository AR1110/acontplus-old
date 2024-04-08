namespace Restaurant.API.Interfaces
{
    public interface IConfigurationService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
    }
}
