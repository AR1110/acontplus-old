namespace Billing.Application.Services.RetencionAts;

public class RetencionAtsService(IAdoRepository adoRepository) : IRetencionAtsService
{
    private const string ModuleName = "FactElect.RetencionAts_";

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Insert", parameters);
    }

    public async Task<SpResponse> CancelAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Cancel", parameters);
    }

    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Delete", parameters);
    }

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters);
        return !DataValidation.DataSetIsNull(ds)
            ? new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) }
            : new SpResponse { Code = "0", Message = "No se encontraron datos" };
    }

    public async Task<SpResponse> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}GetById", parameters);
        return !DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) }
            : new SpResponse { Code = "0", Message = "No se encontraron datos" };

        //var response = await adoRepository.QuerySingleOrDefaultAsync<RetencionAtsDto>($"{ModuleName}GetById", parameters);
        //return new SpResponse { Code = "1", Payload = response };
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Update", parameters);
    }
}
