namespace Inventario.API.Services;

public class SubFamiliaService : ISubFamiliaService
{
    private readonly IAdoRepository _repository;

    public SubFamiliaService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataTableAsync("Inventario.Subfamilia_Get", parameters);
        if (ds.Rows.Count == 0)
        {
            return new ApiResponse { code = "0", message = "Sin registros", payload = null };
        }

        return new ApiResponse
        {
            code = "1", message = "Listado exitosamente", payload = DataConverters.DataTableToJson(ds)
        };
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync("Inventario.Subfamilia_Insert", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync("Almacen.SubFamilia_Update_Cancel", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync("Inventario.Subfamilia_Update", parameters);
    }
}
