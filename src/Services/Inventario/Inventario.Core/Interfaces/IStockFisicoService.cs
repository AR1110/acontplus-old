namespace Inventario.Core.Interfaces
{
    public interface IStockFisicoService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
    }
}
