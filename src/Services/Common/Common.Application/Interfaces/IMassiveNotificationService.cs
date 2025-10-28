namespace Common.Application.Interfaces;

public interface IMassiveNotificationService
{
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
}
