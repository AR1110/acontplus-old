namespace Configuration.Application.Services;

public class UserRoleService : IUserRoleService
{
    private readonly IAdoRepository _repository;
    private readonly string nameSchema = "Config.UserRole_";

    public UserRoleService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync(nameSchema + "Get", parameters);
        return ds.Tables.Count == 0 ? null : (object)DataConverters.DataSetToJson(ds);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>(nameSchema + "Update", parameters);
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>(nameSchema + "Add", parameters);
    }

    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>(nameSchema + "Delete", parameters);
    }

    public async Task<SpResponse> UpdateStatusAsync(int userId, int id, bool status)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userId },
            { "id", id },
            { "estado", status }
        };
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>(nameSchema + "UpdateStatus", parameters);
    }
}
