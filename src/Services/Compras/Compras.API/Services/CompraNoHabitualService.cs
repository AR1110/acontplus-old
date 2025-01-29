namespace Compras.API.Services;

public class CompraNoHabitualService(IAdoRepository _repository) : ICompraNoHabitualService
{
    private const string moduleName = "Compra.Documento_Ingreso_";
    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync($"{moduleName}Get", parameters);
        if (ds.Tables[0].Rows.Count == 0) { return null; }

        return DataConverters.DataSetToJson(ds);
    }

    public async Task<ApiResponse> AddAsync(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", request.UserRoleId }, { "json", DataConverters.SerializeDictionary(request.Data) }
        };
        return await _repository.SpExecuteAsync<ApiResponse>($"{moduleName}Insert", parameters);
    }

    //public async Task<object> GetByIdAsync(Dictionary<string, object> parameters)
    //{
    //    var ds = await _repository.GetDataSetAsync("Compra.Liquidacion_Get_Id", parameters, true);
    //    if (ds.Tables[0].Rows.Count == 0) { return null; }
    //    return DataConverters.DataSetToJSON(ds, true);
    //}

    public async Task<ApiResponse> UpdateAsync(int id, ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", request.UserRoleId },
            { "id", id },
            { "json", DataConverters.SerializeDictionary(request.Data) }
        };
        return await _repository.SpExecuteAsync<ApiResponse>($"{moduleName}Update", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>($"{moduleName}Delete", parameters);
    }
}
