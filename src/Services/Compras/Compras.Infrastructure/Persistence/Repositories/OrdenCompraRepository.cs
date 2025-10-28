namespace Compras.Infrastructure.Persistence.Repositories;

public class OrdenCompraRepository(IAdoRepository _repository) : IOrdenCompraRepository
{
    private const string nameSp = "Compra.Orden_";

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync($"{nameSp}Get", parameters);

        return DataValidation.DataSetIsNull(ds)
            ? new SpResponse { Code = "0", Message = "Can't get data" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>($"{nameSp}Insert", parameters);
    }

    public async Task<SpResponse> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync($"{nameSp}Get_Id", parameters);

        return DataValidation.DataSetIsNull(ds)
            ? new SpResponse { Code = "0", Message = "Can't get data" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>($"{nameSp}Update", parameters);
    }

    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>($"{nameSp}Delete", parameters);
    }
}
