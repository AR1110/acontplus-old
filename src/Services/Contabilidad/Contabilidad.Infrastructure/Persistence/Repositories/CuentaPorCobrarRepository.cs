namespace Contabilidad.Infrastructure.Persistence.Repositories;

public class CuentaPorCobrarRepository(IAdoRepository adoRepository) : ICuentaPorCobrarRepository
{
    private const string ModuleName = "Contabilidad.CuentaPorCobrar_";

    // Cuenta
    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters);
        return ds.Tables.Count == 0 ? null : DataConverters.DataSetToJson(ds);
    }

    //Cuotas
    public async Task<SpResponse> UpdateCuotaAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Contabilidad.CuotaPorCobrar_Update", parameters);
    }

    // Credito Garante
    public async Task<SpResponse> AddGaranteAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Ventas.CreditoGarante_Insert", parameters);
    }
}
