namespace Inventory.Application.Interfaces;

public interface ITransaccionService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    public void Process(Dictionary<string, object> parameters);
}