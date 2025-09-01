namespace Common.Application.Services;

public class DashboardService(IAdoRepository adoRepository) : IDashboardService
{
    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("Common.Dashboard_Get", parameters);
        return DataValidation.DataSetIsNull(ds)
            ? new ApiResponse { Code = "0", Message = "Data not found!" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}