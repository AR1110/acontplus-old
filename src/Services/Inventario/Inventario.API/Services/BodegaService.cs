namespace Inventario.API.Services;

public class BodegaService : IBodegaService
{
    private readonly IAdoRepository _repository;

    public BodegaService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>("Inventario.Bodega_Insert", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>("Inventario.Bodega_Delete", parameters);
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataTableAsync("Inventario.Bodega_Get", parameters);
        if (ds.Rows.Count == 0) return new ApiResponse { Code = "0", Message = "Sin registros", Payload = null };

        return new ApiResponse
        {
            Code = "1",
            Message = "Listado exitosamente",
            Payload = DataConverters.DataTableToJson(ds)
        };
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>("Inventario.Bodega_Update", parameters);
    }
}