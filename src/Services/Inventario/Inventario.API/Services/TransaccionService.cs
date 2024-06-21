namespace Inventario.API.Services;

public class TransaccionService : ITransaccionService
{
    private readonly IAdoRepository _repository;
    private readonly string nameSchema = "Inventario.Transaccion";

    public TransaccionService(IAdoRepository repository)
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

        return DataConverters.DataSetToJson(ds);
    }

    public void Process(Dictionary<string, object> parameters)
    {
        _repository.OnlyExecuteAsync("dbo.Transaccion_Handler_Init", parameters);
    }
}
