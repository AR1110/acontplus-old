namespace Common.API.Endpoints.Interfaces;

public interface ICommonEndpoints
{
    Task<IResult> CreateEmailQueueAsync(ApiRequest apiRequest);
    Task<IResult> CreateNotificationAsync(string json);
    Task<IResult> CreateUserReleaseReadAsync(ApiRequest apiRequest);
    Task<IResult> CreateWhatsappMessageAsync(WhatsappMessageDto whatsappMessageDto);
    Task<IResult> GetDashboardAsync(string json);
    Task<IResult> GetReleaseAsync();
    Task<IResult> GetUserManualAsync(string json);
}