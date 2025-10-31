namespace Configuration.Application.Interfaces;

public interface IUsuarioPermisoService
{
    Task<SpResponse> CheckAsync(Dictionary<string, object> parameters);
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
}
