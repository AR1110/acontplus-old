namespace Configuracion.API.Interfaces;

public interface IGeneralConfigService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<string> UpdateAsync(Dictionary<string, object> parameters);
}
