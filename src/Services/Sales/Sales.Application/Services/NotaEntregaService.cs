namespace Sales.Application.Services;

public class NotaEntregaService(IAdoRepository AdoRepository) : INotaEntregaService
{
    private const string NameSchema = "Ventas.NotaEntrega_";

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await AdoRepository.GetDataSetAsync(NameSchema + "Get", parameters);
        if (ds.Tables[0].Rows.Count == 0) return null;

        return DataConverters.DataSetToJson(ds);
    }

    public async Task<object> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await AdoRepository.GetDataSetAsync(NameSchema + "GetId", parameters);
        if (ds.Tables[0].Rows.Count == 0) return null;

        return DataConverters.DataSetToJson(ds);
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await AdoRepository.QuerySingleOrDefaultAsync<SpResponse>(NameSchema + "Insert", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await AdoRepository.QuerySingleOrDefaultAsync<SpResponse>(NameSchema + "Update", parameters);
    }

    public async Task<SpResponse> CancelAsync(Dictionary<string, object> parameters)
    {
        return await AdoRepository.QuerySingleOrDefaultAsync<SpResponse>(NameSchema + "Cancel", parameters);
    }

    public async Task<SpResponse> ConvertToDocAsync(Dictionary<string, object> parameters)
    {
        return await AdoRepository.QuerySingleOrDefaultAsync<SpResponse>(NameSchema + "Convert_To_Doc", parameters);
    }
}
