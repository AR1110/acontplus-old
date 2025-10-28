namespace TechnicalSupport.Domain.Repositories;

public interface IDeviceSpecRepository
{
    public Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    public Task<SpResponse> AddAsync(DeviceSpecs data);
    public Task<SpResponse> UpdateAsync(int id, DeviceSpecs data);
}
