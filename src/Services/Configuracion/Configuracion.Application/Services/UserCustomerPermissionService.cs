namespace Configuracion.Application.Services;

public class UserCustomerPermissionService : IUserCustomerPermissionService
{
    private readonly IAdoRepository _repository;
    private readonly string nameSchema = "Config.UserCustomerPermission_";

    public UserCustomerPermissionService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync(nameSchema + "Get", parameters);
        if (ds.Tables.Count == 0)
        {
            return null;
        }

        return DataConverters.DataSetToJson(ds);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>(nameSchema + "Update", parameters);
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>(nameSchema + "Insert", parameters);
    }
}
