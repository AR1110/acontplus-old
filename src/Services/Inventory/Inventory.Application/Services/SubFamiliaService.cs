namespace Inventory.Application.Services;

public class SubFamiliaService : ISubFamiliaService
{
    private readonly IAdoRepository _repository;

    public SubFamiliaService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("Inventario.Subfamilia_Get", parameters);
        var dt = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return dt.Rows.Count == 0
            ? new SpResponse { Code = "0", Message = "Sin registros", Payload = null }
            : new SpResponse
            {
                Code = "1",
                Message = "Listado exitosamente",
                Payload = DataConverters.DataTableToJson(dt)
            };
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>("Inventario.Subfamilia_Insert", parameters);
    }

    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>("Almacen.SubFamilia_Update_Cancel", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>("Inventario.Subfamilia_Update", parameters);
    }
}
