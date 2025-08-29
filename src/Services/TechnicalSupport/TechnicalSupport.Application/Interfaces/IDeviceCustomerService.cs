namespace TechnicalSupport.Application.Interfaces;

public interface IDeviceCustomerService
{
    public Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}