namespace Configuration.Application.Services;

public class UserService(IAdoRepository adoRepository) : IUserService
{
    private const string NameSchema = "Config.User";

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync(NameSchema + "_Get", parameters);
        return ds.Tables.Count == 0 ? null : DataConverters.DataSetToJson(ds);
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters) =>
        await adoRepository.QuerySingleOrDefaultAsync<SpResponse>(NameSchema + "_Insert", parameters);

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters) =>
        await adoRepository.QuerySingleOrDefaultAsync<SpResponse>(NameSchema + "_Update", parameters);
}
