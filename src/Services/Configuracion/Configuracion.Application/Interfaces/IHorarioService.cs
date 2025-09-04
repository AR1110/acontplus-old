namespace Configuracion.Application.Interfaces;

public interface IHorarioService
{
    Task<LegacySpResponse> GetAsync(int userRoleId, int turnoId);
    Task<LegacySpResponse> GetDaysAsync();
}
