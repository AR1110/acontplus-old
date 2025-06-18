namespace FactElect.Application.Services.Sri;

public class CatalogoService(IAdoRepository adoRepository) : ICatalogoService
{
    private const string ModuleName = "Sri.Catalogo_";

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters, withTableNames: false);
        var dt = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return DataValidation.DataTableIsNull(dt)
            ? new ApiResponse { Code = "0", Message = "Data not found" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }
}