namespace FactElect.API.Services;

public class FacturaService(IAdoRepository repository) : IFacturaService
{
    private const string _nameSchema = "Ventas.Factura_";

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync(_nameSchema + "Get", parameters, true, false);
        if (ds.Tables[0].Rows.Count == 0) { return null; }

        return DataConverters.DataSetToJson(ds, true);
    }

    public async Task<object> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync(_nameSchema + "Get_Id", parameters, true);
        if (ds.Tables[0].Rows.Count == 0) { return null; }

        return DataConverters.DataSetToJson(ds, true);
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await repository.SpExecuteAsync<ApiResponse>(_nameSchema + "Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await repository.SpExecuteAsync<ApiResponse>(_nameSchema + "Update", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await repository.SpExecuteAsync<ApiResponse>(_nameSchema + "Delete", parameters);
    }
}
