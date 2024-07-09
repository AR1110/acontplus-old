namespace Compras.API.Interfaces
{
    public interface IArticuloService
    {
        Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    }
}
