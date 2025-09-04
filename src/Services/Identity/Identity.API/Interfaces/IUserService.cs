namespace Identity.API.Interfaces;

public interface IUserService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
}
