namespace Configuracion.API.Services;

public class UserCustomerService : IUserCustomerService
{
    private readonly IAdoRepository _repository;
    private readonly string nameSchema = "Config.UserCustomer";

    public UserCustomerService(IAdoRepository repository)
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

        return DataConverters.DataSetToJson(ds);
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync(nameSchema + "_Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync(nameSchema + "_Update", parameters);
    }
}
