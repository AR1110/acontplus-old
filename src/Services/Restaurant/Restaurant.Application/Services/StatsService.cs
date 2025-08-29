using Common.Core.Abstractions;

namespace Restaurant.Application.Services;

public class StatsService(IAdoRepository adoRepository) : IStatsService
{
    private const string ModuleName = "Restaurant.Stats_";

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters, disableTimeout: true);
        return DataValidation.DataSetIsNull(ds, true)
            ? new ApiResponse { Code = "0", Message = "Can't get data" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}
