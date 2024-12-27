using Common.AppSettings;

namespace Identity.API.Interfaces;

public interface IUserService
{
    Task<LegacyApiResponse> GetAsync(Dictionary<string, object> parameters);
}
