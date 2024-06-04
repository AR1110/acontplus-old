namespace Inventario.API.Services;

public class MassiveTaxService : IMassiveTaxService
{
    private readonly IAdoRepository _repository;
    private readonly string nameSchema = "Inventario.ImpuestoMasivo";

    public MassiveTaxService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync(nameSchema + "_Get", parameters);
        if (ds.Tables.Count == 0)
        {
            return null;
        }

        return DataConverters.DataSetToJSON(ds);
    }


    public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteDeprecatedAsync(nameSchema + "_Update", parameters, false);
    }
}
