namespace FactElect.API.Services.Sri;

public interface ICatalogoService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}

public class CatalogoService(IAdoRepository adoRepository) : ICatalogoService
{
    private const string ModuleName = "Sri.Catalogo_";

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var dt = await adoRepository.GetDataTableAsync($"{ModuleName}Get", parameters);
        return DataValidation.DataTableIsNull(dt)
            ? new ApiResponse { Code = "0", Message = "Data not found" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }
}
