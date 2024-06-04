namespace Inventario.API.Services;

public class StockFisicoService : IStockFisicoService
{
    private readonly IAdoRepository _repository;
    private readonly ApiResponse _response;

    public StockFisicoService(IAdoRepository repository)
    {
        _repository = repository;
        _response = new ApiResponse();
    }

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("Inventario.StockFisico_Get", parameters);

        if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
        {
            if (ds.Tables.Count > 0)
            {
                ds = new DataSet();
            }

            return null;
        }

        return DataConverters.DataSetToJSON(ds);
    }

    public async Task<string> AddAsync(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", request.UserRoleId }, { "json", DataConverters.SerializeDictionary(request.Data) }
        };
        return await _repository.SpExecuteDeprecatedAsync("Inventario.StockFisico_Insert", parameters);
    }

    public async Task<string> UpdateAsync(int id, ApiRequest request)
    {
        // _context.StockFisicos.Add(stockFisico);
        // await _context.SaveChangesAsync(); 
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", request.UserRoleId },
            { "id", id },
            { "json", DataConverters.SerializeDictionary(request.Data) }
        };
        return await _repository.SpExecuteDeprecatedAsync("Inventario.StockFisico_Update", request.Data);
    }

    public async Task<ApiResponse> DeleteAsync(int id)
    {
        // _context.StockFisicos.Add(stockFisico);
        // await _context.SaveChangesAsync(); 
        var dt = await _repository.GetDataTableAsync("Inventario.StockFisico_Delete", null);
        if (!DataValidation.DataTableIsNull(dt))
        {
            _response.Create("1", payload: DataTableMapper.BindData<ApiResponse>(dt));
        }
        else
        {
            _response.Create("0", "La transacción no devolvio respuesta");
        }

        return _response;
    }
}
