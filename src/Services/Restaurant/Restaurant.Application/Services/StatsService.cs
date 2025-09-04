namespace Restaurant.Application.Services;

public class StatsService(IAdoRepository adoRepository) : IStatsService
{
    private const string ModuleName = "Restaurant.Stats_";

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var commandOptions = new CommandOptionsDto
        {
            CommandTimeout = 0
        };
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters, commandOptions);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "Can't get data" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}
