namespace Restaurant.Core.Interfaces
{
    public interface IConfigurationService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
    }
}
