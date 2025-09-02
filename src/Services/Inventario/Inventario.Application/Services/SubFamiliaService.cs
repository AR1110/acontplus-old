namespace Inventario.Application.Services;

public class SubFamiliaService : ISubFamiliaService
{
    private readonly IAdoRepository _repository;

    public SubFamiliaService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("Inventario.Subfamilia_Get", parameters, withTableNames: false);
        var dt = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        if (dt.Rows.Count == 0) return new ApiResponse { Code = "0", Message = "Sin registros", Payload = null };

        return new ApiResponse
        {
            Code = "1",
            Message = "Listado exitosamente",
            Payload = DataConverters.DataTableToJson(dt)
        };
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>("Inventario.Subfamilia_Insert", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>("Almacen.SubFamilia_Update_Cancel", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>("Inventario.Subfamilia_Update", parameters);
    }
}