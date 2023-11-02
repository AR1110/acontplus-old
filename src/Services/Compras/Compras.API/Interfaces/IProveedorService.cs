namespace Compras.API.Interfaces
{
    public interface IProveedorService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        //Task<string> AddAsync(Dictionary<string, object> parameters);
        //Task<string> Updatesync(Dictionary<string, object> parameters);
        //Task<string> DeleteAsync(Dictionary<string, object> parameters);
    }
}
