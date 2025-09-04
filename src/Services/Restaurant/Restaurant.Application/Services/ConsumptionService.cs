namespace Restaurant.Application.Services;

public class ConsumptionService(IAdoRepository adoRepository) : IConsumptionService
{
    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("Restaurant.ConsumoTpv_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "Data not found" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.ConsumoTpv_Insert", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.ConsumoTpv_Update", parameters);
    }

    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.ConsumoTpv_Delete", parameters);
    }

    public async Task<SpResponse> PrintAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.ConsumoTpv_Print", parameters);
    }
}
