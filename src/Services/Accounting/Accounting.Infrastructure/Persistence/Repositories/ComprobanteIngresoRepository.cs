namespace Accounting.Infrastructure.Persistence.Repositories;

public class ComprobanteIngresoRepository : IComprobanteIngresoRepository
{
    private readonly IAdoRepository _repository;
    private readonly string nameSchema = "Contabilidad.ComprobanteIngreso_";

    public ComprobanteIngresoRepository(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync(nameSchema + "Get", parameters);
        return ds.Tables.Count == 0
            ? new SpResponse { Code = "1", Message = "No existen datos." }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }


    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>(nameSchema + "Insert", parameters);
    }


    public async Task<SpResponse> CancelAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>(nameSchema + "Update_Cancel", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>(nameSchema + "Update", parameters);
    }
}
