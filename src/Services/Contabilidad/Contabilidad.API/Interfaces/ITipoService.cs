using Common.AppSettings;

namespace Contabilidad.API.Interfaces;

public interface ITipoService
{
    Task<ApiResponseDeprecated> AddAsync(Tipo tipo);
    Task<ApiResponseDeprecated> DeleteAsync(int userId, int id);
    Task<ApiResponseDeprecated> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponseDeprecated> UpdateAsync(int id, Tipo tipo);
}
