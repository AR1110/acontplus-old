namespace TechnicalSupport.API.Interfaces
{
    public interface IDeviceService
    {
        public Task<object> GetAsync(Dictionary<string, object> parameters);
    }
}
