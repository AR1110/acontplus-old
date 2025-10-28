namespace TechnicalSupport.Domain.Repositories;

public interface IDeviceRepository
{
    public Task<SpResponse> AddAsync(Device device);
    public Task<SpResponse> DeleteAsync(int id, int userId);
    public Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    public Task<SpResponse> UpdateAsync(int id, Device device);
}
