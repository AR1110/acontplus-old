namespace Common.Core.Interfaces
{
    public interface INotificacionService
    {
        Task<string> AddAsync(Dictionary<string, object> parameters);
    }
}
