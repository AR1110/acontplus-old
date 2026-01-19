namespace Identity.Api.Services;

public class UserProfileService : IUserProfileService
{
    private readonly IAdoRepository _repository;
    private readonly string nameSchema = "Config.UserProfile";

    public UserProfileService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>(nameSchema + "_Update", parameters);
    }

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync(nameSchema + "_Get", parameters);

        return ds == null
            ? new SpResponse { Code = "0", Message = "No se pudo obtener los datos" }
            : new SpResponse { Code = "0", Message = "Ok", Payload = DataConverters.DataSetToJson(ds) };
    }
}
