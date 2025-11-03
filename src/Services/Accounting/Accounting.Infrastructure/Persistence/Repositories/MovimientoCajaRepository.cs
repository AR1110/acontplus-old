namespace Accounting.Infrastructure.Persistence.Repositories;

public class MovimientoCajaRepository(IAdoRepository adoRepository) : IMovimientoCajaRepository
{
    private const string NameSchema = "Contabilidad.MovimientoCaja_";

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{NameSchema}Get", parameters);
        return ds.Tables.Count == 0
            ? new SpResponse { Code = "0", Message = "No data found." }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }


    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{NameSchema}Insert", parameters);
    }

    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{NameSchema}Delete", parameters);
    }
}
