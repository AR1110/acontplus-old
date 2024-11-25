using Common.AppSettings;

namespace Identity.API.Interfaces;

public interface IUserService
{
    Task<ApiResponseDeprecated> GetAsync(Dictionary<string, object> parameters);
}
