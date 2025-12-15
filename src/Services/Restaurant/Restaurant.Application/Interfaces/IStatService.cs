namespace Restaurant.Application.Interfaces;

public interface ISatService
{
    Task<SpResponse> GetByIdAsync(Dictionary<string, object> parameters);
    public Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    public Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
}
