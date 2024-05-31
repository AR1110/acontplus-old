namespace Configuracion.API.Services;

public class UserCustomerRequestService : IUserCustomerRequestService
{
    private readonly IAdoRepository _repository;
    private readonly string nameSchema = "Config.UserCustomerRequest_";

    public UserCustomerRequestService(IAdoRepository repository)
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

        return DataConverters.DataSetToJSON(ds);
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync(nameSchema + "Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync(nameSchema + "Update", parameters);
    }
}
