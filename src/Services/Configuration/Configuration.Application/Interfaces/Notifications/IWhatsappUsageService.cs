namespace Configuration.Application.Interfaces.Notifications;

public interface IWhatsappUsageService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
}
