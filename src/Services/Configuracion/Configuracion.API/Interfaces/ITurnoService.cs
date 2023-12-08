namespace Configuracion.API.Interfaces
{
    public interface ITurnoService
    {
        Task<string> GetAsync(Dictionary<string, object> parameters);
    }
}
