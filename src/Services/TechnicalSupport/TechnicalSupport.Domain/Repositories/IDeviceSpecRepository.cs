namespace TechnicalSupport.Domain.Repositories;

public interface IDeviceSpecRepository
{
    public Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    public Task<ApiResponse> AddAsync(DeviceSpecs data);
    public Task<ApiResponse> UpdateAsync(int id, DeviceSpecs data);
}
