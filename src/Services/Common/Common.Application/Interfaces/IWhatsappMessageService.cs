namespace Common.Application.Interfaces;

public interface IWhatsappMessageService
{
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
}
