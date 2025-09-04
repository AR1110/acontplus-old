namespace Common.Application.Services;

public class UserReleaseReadService(IAdoRepository adoRepository) : IUserReleaseReadService
{
    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters) =>
        await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Common.UserReleaseRead_Insert", parameters);
}
