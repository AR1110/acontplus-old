namespace Configuration.Application.Interfaces;

public interface IHorarioService
{
    Task<SpResponse> GetAsync(int userRoleId, int turnoId);
    Task<SpResponse> GetDaysAsync();
}
