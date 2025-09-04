namespace Common.Application.Interfaces;

public interface INotificationService
{
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    Task<SpResponse> DeleteAsync(int id);
}
