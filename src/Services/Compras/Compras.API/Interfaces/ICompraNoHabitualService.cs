namespace Compras.API.Interfaces;

public interface ICompraNoHabitualService
{
  Task<object> GetAsync(Dictionary<string, object> parameters);

  Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);

  //  Task<object> GetByIdAsync(Dictionary<string, object> parameters);
  Task<ApiResponse> UpdateAsync(int id, Dictionary<string, object> parameters);
  Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
}