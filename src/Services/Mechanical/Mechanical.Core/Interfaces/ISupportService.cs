namespace Mechanical.Core.Interfaces
{
    public interface ISupportService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<string> AddAsync(Dictionary<string, object> parameters);
        Task<string> UpdateAsync(Dictionary<string, object> parameters);
        Task<bool> DeleteAsync(int id);
    }
}
