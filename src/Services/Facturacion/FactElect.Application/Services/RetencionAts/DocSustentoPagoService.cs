namespace FactElect.Application.Services.RetencionAts;

public class DocSustentoPagoService(IAdoRepository adoRepository) : IDocSustentoPagoService
{
    private const string ModuleName = "FactElect.RetAts_Doc_Sust_Pago_";

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Insert", parameters);
    }

    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Delete", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Update", parameters);
    }
}
