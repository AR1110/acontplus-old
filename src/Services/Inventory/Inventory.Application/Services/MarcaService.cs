namespace Inventory.Application.Services;

public class MarcaService : IBrandService
{
    private readonly IAdoRepository _repository;
    private readonly string nameSchema = "Inventario.Marca";

    public MarcaService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync(nameSchema + "_Get", parameters);
        return ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0
            ? new SpResponse { Code = "0", Message = "Sin registros", Payload = null }
            : new SpResponse
            {
                Code = "1",
                Message = "Listado exitosamente",
                Payload = DataConverters.DataSetToJson(ds)
            };
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>(nameSchema + "_Insert", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>(nameSchema + "_Update", parameters);
    }

    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>(nameSchema + "_Delete", parameters);
    }
}
