namespace Inventory.Application.Interfaces;

public interface IMassiveTaxService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
}
