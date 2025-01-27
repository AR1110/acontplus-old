namespace Common.API.Interfaces;

public interface IWhatsappMessageService
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
}
