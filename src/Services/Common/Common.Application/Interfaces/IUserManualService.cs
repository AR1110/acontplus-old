namespace Common.Application.Interfaces;

public interface IUserManualService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
}
