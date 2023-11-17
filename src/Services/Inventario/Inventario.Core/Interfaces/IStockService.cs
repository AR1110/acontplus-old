namespace Inventario.Core.Interfaces
{
    public interface IStockService
    {
        Task<string> UpdateAsync(Dictionary<string, object> parameters);
    }
}
