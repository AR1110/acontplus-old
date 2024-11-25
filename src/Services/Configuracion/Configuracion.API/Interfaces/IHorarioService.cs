using Common.AppSettings;

namespace Configuracion.API.Interfaces;

public interface IHorarioService
{
    Task<ApiResponseDeprecated> GetAsync(int userRoleId, int turnoId);
    Task<ApiResponseDeprecated> GetDaysAsync();
}
