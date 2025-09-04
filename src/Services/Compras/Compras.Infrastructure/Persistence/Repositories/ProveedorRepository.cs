namespace Compras.Infrastructure.Persistence.Repositories;

public class ProveedorRepository(IAdoRepository _repo) : IProveedorRepository
{
    private const string ModuleName = "Compra.Proveedor_";

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repo.GetDataSetAsync($"{ModuleName}Get", parameters);
        return DataValidation.DataSetIsNull(ds)
            ? new SpResponse { Code = "0", Message = "Can't get data" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repo.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Insert", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repo.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Update", parameters);
    }

    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repo.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Delete", parameters);
    }
}
