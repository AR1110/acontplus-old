namespace Configuracion.Application.Services.Sri;

public class PuntoEmisionAsignacionService(IAdoRepository adoRepository) : IPuntoEmisionAsignacionService
{
    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("Config.PtoEmi_Asig_Get", parameters);
        return DataValidation.DataSetIsNull(ds) ? null : DataConverters.DataSetToJson(ds);
    }


    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Config.PtoEmi_Asig_Insert", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Config.PtoEmi_Asig_Update", parameters);
    }

    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Contabilidad.Caja_Delete", parameters);
    }
}
