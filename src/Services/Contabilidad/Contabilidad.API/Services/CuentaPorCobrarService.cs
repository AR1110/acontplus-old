namespace Contabilidad.API.Services;

public class CuentaPorCobrarService(IAdoRepository adoRepository) : ICuentaPorCobrarService
{
    private const string ModuleName = "Contabilidad.CuentaPorCobrar_";

    // Cuenta
    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters);
        return ds.Tables.Count == 0 ? null : DataConverters.DataSetToJson(ds);
    }

    //Cuotas
    public async Task<ApiResponse> UpdateCuotaAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"Contabilidad.CuotaPorCobrar_Update", parameters);
    }

    // Credito Garante
    public async Task<ApiResponse> AddGaranteAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"Ventas.CreditoGarante_Insert", parameters);
    }

}
