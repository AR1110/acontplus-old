namespace Configuracion.API.Interfaces
{
    public interface IUserCustomerService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<string> UpdateAsync(Dictionary<string, object> parameters);
    }
}
