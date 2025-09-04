using Acontplus.Utilities.Data;

namespace Vet.Application.Services;

public class StatsService(IAdoRepository repository) : IStatsService
{
    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Vet.Stats_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "La transacción no devolvio respuesta" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}
