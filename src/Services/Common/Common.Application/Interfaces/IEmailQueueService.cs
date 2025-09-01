namespace Common.Application.Interfaces;

public interface IEmailQueueService
{
    Task<ApiResponse> SendAsync(ApiRequest apiRequest);
}