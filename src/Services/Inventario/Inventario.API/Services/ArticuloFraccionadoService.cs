namespace Inventario.API.Services;

public class ArticuloFraccionadoService(IAdoRepository _repository) : IArticuloFraccionadoService
{
    private const string nameSp = "Inventario.Fraccionado_";

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync($"{nameSp}Get", parameters);

        if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
        {
            if (ds.Tables.Count > 0)
            {
                ds = new DataSet();
            }

            return null;
        }

        return DataConverters.DataSetToJson(ds);
    }

    public async Task<ApiResponse> AddAsync(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", request.UserRoleId }, { "json", DataConverters.SerializeDictionary(request.Data) }
        };
        return await _repository.SpExecuteAsync<ApiResponse>($"{nameSp}Insert", parameters);
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
