namespace Identity.Application.Interfaces;

public interface IUserRequestService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
}

