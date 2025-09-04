namespace Configuracion.Application.Services;

public class UserCustomerRoleService : IUserCustomerRoleService
{
    private readonly IAdoRepository _repository;
    private readonly string nameSchema = "Config.UserCustomerRole_";

    public UserCustomerRoleService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync(nameSchema + "Get", parameters);
        if (ds.Tables.Count == 0) return null;

        return DataConverters.DataSetToJson(ds);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>(nameSchema + "Update", parameters);
    }
}
