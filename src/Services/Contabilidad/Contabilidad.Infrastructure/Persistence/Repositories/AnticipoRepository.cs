namespace Contabilidad.Infrastructure.Persistence.Repositories;

public class AnticipoRepository(IAdoRepository adoRepository) : IAnticipoRepository
{
    private const string NameSchema = "Contabilidad.Anticipo_";

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

    public Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        throw new NotImplementedException("Update method is not implemented yet.");
    }

    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{NameSchema}Delete", parameters);
    }
}
