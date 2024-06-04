using Common.Core.Interfaces;
using Common.Core.Utils;
using Inventario.API.Interfaces;

namespace Inventario.API.Services;

public class PrecioMasivoService : IPrecioMasivoService
{
    private readonly IAdoRepository _repository;

    public PrecioMasivoService(IAdoRepository repository)
    {
        _repository = repository;
    }


    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("Inventario.PrecioMasivo_Get", parameters);
        if (ds.Tables.Count == 0)
        {
            return null;
        }

        return DataConverters.DataSetToJSON(ds);
    }


    public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteDeprecatedAsync("Inventario.PrecioMasivo_Update", parameters);
    }
}
