namespace Configuracion.API.Interfaces
{
    public interface IPrintService
    {
        Task<string> GetAsync(Dictionary<string, object> parameters);
    }
}
