namespace Common.API.Interfaces;

public interface IEmailQueueService
{
    Task<ApiResponse> SendAsync(ApiRequest apiRequest);
}