namespace Mechanical.Core.Interfaces
{
    public interface ISupportService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
    }
}
