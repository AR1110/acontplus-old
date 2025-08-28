namespace Compras.Infrastructure.Persistence.Repositories;

public class FacturaCompraRepository(IAdoRepository _repository) : IFacturaCompraRepository
{
    private const string moduleName = "Compra.Factura_";

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync($"{moduleName}Get", parameters);
        if (ds.Tables[0].Rows.Count == 0) return null;

        return DataConverters.DataSetToJson(ds);
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>($"{moduleName}Insert", parameters);
    }

    public async Task<object> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync($"{moduleName}Get_Id", parameters, false);
        if (ds.Tables[0].Rows.Count == 0) return null;

        return DataConverters.DataSetToJson(ds, true);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>($"{moduleName}Update", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>($"{moduleName}Delete", parameters);
    }
}