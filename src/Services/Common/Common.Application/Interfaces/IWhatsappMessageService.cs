namespace Common.Application.Interfaces;

public interface IWhatsappMessageService
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
}