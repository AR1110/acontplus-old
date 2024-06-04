using Common.Core.Interfaces;
using Common.Core.Utils;
using Inventario.API.Interfaces;

namespace Inventario.API.Services;

public class TransferenciaBodegaService : ITransferenciaBodegaService
{
    private readonly IAdoRepository _repository;
    private readonly string nameSchema = "Inventario.TransferenciaBodega";

    public TransferenciaBodegaService(IAdoRepository repository)
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

    public async Task<object> GetIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync(nameSchema + "_Get_Id", parameters);
        if (ds.Tables.Count == 0)
        {
            return null;
        }

        return DataConverters.DataSetToJSON(ds);
    }


    public async Task<string> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteDeprecatedAsync(nameSchema + "_Insert", parameters);
    }

    public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteDeprecatedAsync(nameSchema + "_Update", parameters);
    }

    public async Task<string> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteDeprecatedAsync(nameSchema + "_Delete", parameters);
    }
}
