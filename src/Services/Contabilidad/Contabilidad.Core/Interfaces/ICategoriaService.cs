namespace Contabilidad.Core.Interfaces
{
    public interface ICategoriaService
    {
        Task<string> GetAsync(Dictionary<string, object> parameters);
    }
}
