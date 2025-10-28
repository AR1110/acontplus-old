namespace Contabilidad.Infrastructure.Persistence.Repositories;

public class ControlCajaRepository(IAdoRepository adoRepository) : IControlCajaRepository
{
    private const string NameSchema = "Contabilidad.ControlCaja_";

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

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{NameSchema}Update", parameters);
    }

    public Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        throw new NotImplementedException("Delete operation is not implemented yet.");
    }
}
