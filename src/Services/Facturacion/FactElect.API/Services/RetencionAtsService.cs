namespace FactElect.API.Services;

public class RetencionAtsService(IAdoRepository adoRepository) : IRetencionAtsService
{
    private const string ModuleName = "FactElect.RetencionAts_";

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters, true);
        return !DataValidation.DataSetIsNull(ds)
            ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds, true) }
            : new ApiResponse { Code = "0", Message = "No se encontraron datos" };
    }
}
