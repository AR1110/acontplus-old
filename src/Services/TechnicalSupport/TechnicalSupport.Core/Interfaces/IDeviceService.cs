namespace TechnicalSupport.Core.Interfaces
{
    public interface IDeviceService
    {
        public Task<object> GetAsync(Dictionary<string, object> parameters);
    }
}
