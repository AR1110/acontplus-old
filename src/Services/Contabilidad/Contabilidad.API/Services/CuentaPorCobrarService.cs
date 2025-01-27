namespace Contabilidad.API.Services;

public class CuentaPorCobrarService(IAdoRepository adoRepository) : ICuentaPorCobrarService
{
    private const string ModuleName = "Contabilidad.CuentaPorCobrar_";

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters);
        return ds.Tables.Count == 0 ? null : DataConverters.DataSetToJson(ds);
    }


    //
    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"Contabilidad.CuotaPorCobrar_Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"Contabilidad.CuotaPorCobrar_Update", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Delete", parameters);
    }
}
