namespace FactElect.Application.Services.RetencionAts;

public class DocSustentoService(IAdoRepository adoRepository) : IDocSustentoService
{
    private const string ModuleName = "FactElect.RetAts_Doc_Sust_";

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters) =>
        await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Insert", parameters);

    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters) =>
        await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Delete", parameters);

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters);
        return !DataValidation.DataSetIsNull(ds)
            ? new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) }
            : new SpResponse { Code = "0", Message = "No se encontraron datos" };
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters) =>
        await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Update", parameters);
}
