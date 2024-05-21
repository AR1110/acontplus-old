namespace Configuracion.API.Services;

public class UserCustomerService : IUserCustomerService
{
    private readonly IADORepository _repository;
    private readonly string nameSchema = "Config.UserCustomer";

    public UserCustomerService(IADORepository repository)
    {
        _repository = repository;
    }

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync(nameSchema + "_Get", parameters);
        if (ds.Tables.Count == 0)
        {
            return null;
        }

        return DataConverters.DataSetToJSON(ds);
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SPExecuteAsync(nameSchema + "_Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SPExecuteAsync(nameSchema + "_Update", parameters);
    }
}
