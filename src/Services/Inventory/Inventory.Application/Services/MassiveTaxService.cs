namespace Inventory.Application.Services;

public class MassiveTaxService(IAdoRepository adoRepository) : IMassiveTaxService
{
    private const string ModuleName = "Inventario.ImpuestoMasivo";

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync(ModuleName + "_Get", parameters);
        return ds.Tables.Count == 0 ? null : (object)DataConverters.DataSetToJson(ds);
    }


    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        var commandOptions = new CommandOptionsDto
        {
            CommandTimeout = 0
        };
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>(ModuleName + "_Update", parameters, commandOptions);
    }
}
