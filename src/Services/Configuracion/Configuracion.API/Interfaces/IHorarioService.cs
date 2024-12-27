using Common.AppSettings;

namespace Configuracion.API.Interfaces;

public interface IHorarioService
{
    Task<LegacyApiResponse> GetAsync(int userRoleId, int turnoId);
    Task<LegacyApiResponse> GetDaysAsync();
}
