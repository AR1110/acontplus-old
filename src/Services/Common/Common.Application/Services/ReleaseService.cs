namespace Common.Application.Services;

public class ReleaseService(IAdoRepository AdoRepository) : IReleaseService
{
    public async Task<SpResponse> GetAsync(int userRoleId)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", userRoleId } };
        var releases = await AdoRepository.QueryAsync<ReleaseDto>("Common.Release_Get", parameters);

        if (releases == null || releases.Count == 0) return new SpResponse { Code = "0", Message = "Data not found!" };

        return new SpResponse { Code = "1", Payload = releases };
    }
}
