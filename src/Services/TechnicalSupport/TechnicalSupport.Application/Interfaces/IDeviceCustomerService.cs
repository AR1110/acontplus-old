namespace TechnicalSupport.Application.Interfaces;

public interface IDeviceCustomerService
{
    public Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
}
