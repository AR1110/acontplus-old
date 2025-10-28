namespace Mechanical.Domain.Repositories;

public interface IVehicleRepository
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
    Task<SpResponse> DeleteAsync(int id);
    Task<SpResponse> UpdateStateAsync(int id, bool state);
}
