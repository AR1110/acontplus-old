using Common.AppSettings;

namespace Mechanical.API.Interfaces
{
    public interface IVehicleService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<string> AddAsync(Dictionary<string, object> parameters);
        Task<string> UpdateAsync(Dictionary<string, object> parameters);
        Task<ApiResponseDeprecated> DeleteAsync(int id);
        Task<ApiResponseDeprecated> UpdateStateAsync(int id, bool state);

    }
}
