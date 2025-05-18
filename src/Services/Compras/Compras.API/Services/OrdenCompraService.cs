namespace Compras.API.Services;

public class OrdenCompraService(IAdoRepository _repository) : IOrdenCompraService
{
    private const string nameSp = "Compra.Orden_";

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync($"{nameSp}Get", parameters);

        return DataValidation.DataSetIsNull(ds)
            ? new ApiResponse { Code = "0", Message = "Can't get data" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<ApiResponse> AddAsync(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", request.UserRoleId }, { "json", DataConverters.SerializeDictionary(request.Data) }
        };
        return await _repository.SpExecuteAsync<ApiResponse>($"{nameSp}Insert", parameters);
    }

    public async Task<ApiResponse> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync($"{nameSp}Get_Id", parameters);

        return DataValidation.DataSetIsNull(ds)
            ? new ApiResponse { Code = "0", Message = "Can't get data" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<ApiResponse> UpdateAsync(int id, ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", request.UserRoleId },
            { "id", id },
            { "json", DataConverters.SerializeDictionary(request.Data) }
        };
        return await _repository.SpExecuteAsync<ApiResponse>($"{nameSp}Update", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>($"{nameSp}Delete", parameters);
    }
}