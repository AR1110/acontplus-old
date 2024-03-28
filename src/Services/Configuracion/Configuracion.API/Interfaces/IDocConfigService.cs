namespace Configuracion.API.Interfaces
{
    public interface IDocConfigService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<string> UpdateAsync(Dictionary<string, object> parameters);
    }
}
