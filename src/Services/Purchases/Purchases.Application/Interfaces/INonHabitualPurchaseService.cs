namespace Purchases.Application.Interfaces;

public interface INonHabitualPurchaseService
{
  Task<object> GetAsync(Dictionary<string, object> parameters);
  Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
  Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
  Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters);
}
