using Common.AppSettings;

namespace Contabilidad.API.Interfaces;

public interface ITipoService
{
    Task<LegacyApiResponse> AddAsync(Tipo tipo);
    Task<LegacyApiResponse> DeleteAsync(int userId, int id);
    Task<LegacyApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<LegacyApiResponse> UpdateAsync(int id, Tipo tipo);
}
