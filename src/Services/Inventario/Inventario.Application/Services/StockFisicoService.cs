namespace Inventario.Application.Services;

public class StockFisicoService(IAdoRepository _repository) : IStockFisicoService
{
    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("Inventario.StockFisico_Get", parameters);

        if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
        {
            if (ds.Tables.Count > 0) ds = new DataSet();

            return null;
        }
        return DataConverters.DataSetToJson(ds);
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>("Inventario.StockFisico_Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>("Inventario.StockFisico_Update", parameters);
    }

    //public async Task<LegacyApiResponse> DeleteAsync(int id)
    //{

    //    var dt = await _repository.GetDataTableAsync("Inventario.StockFisico_Delete", null);
    //    if (!DataValidation.DataTableIsNull(dt))
    //    {
    //        _response.Create("1", payload: DataTableMapper.MapDataRowToModel<LegacyApiResponse>(dt.Rows[0]));
    //    }
    //    else
    //    {
    //        _response.Create("0", "La transacción no devolvio respuesta");
    //    }

    //    return _response;
    //}
}
