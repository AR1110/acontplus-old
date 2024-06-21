namespace Contabilidad.API.Services;

public class ChequeService : IChequeService
{
    private readonly IAdoRepository _repository;

    public ChequeService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("Contabilidad.Cheque_Get", parameters);
        if (ds.Tables.Count == 0)
        {
            return null;
        }

        return DataConverters.DataSetToJson(ds);
    }


    public async Task<string> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteDeprecatedAsync("Contabilidad.Caja_Insert", parameters);
    }

    public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteDeprecatedAsync("Contabilidad.Caja_Update", parameters);
    }

    public async Task<string> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteDeprecatedAsync("Contabilidad.Caja_Delete", parameters);
    }
}
