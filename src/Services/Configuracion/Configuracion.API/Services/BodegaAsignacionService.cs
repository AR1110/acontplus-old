namespace Configuracion.API.Services;

public class BodegaAsignacionService(IAdoRepository adoRepository) : IBodegaAsignacionService
{
    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("Config.Bodeg_Asig_Get", parameters);
        return DataValidation.DataSetIsNull(ds) ? null : DataConverters.DataSetToJson(ds);
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>("Config.Bodeg_Asig_Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>("Config.Bodeg_Asig_Update", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>("Contabilidad.Caja_Delete", parameters);
    }
}
