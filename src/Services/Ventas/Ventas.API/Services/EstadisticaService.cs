namespace Ventas.API.Services;

public interface IEstadisticaService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}

public class EstadisticaService(IAdoSqlServer adoSqlServer) : IEstadisticaService
{
    private const string ModuleName = "Ventas.Estadisticas_Dashboard_";

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var dt = await adoSqlServer.GetDataTableAsync($"{ModuleName}Get", parameters);
        return DataValidation.DataTableIsNull(dt)
            ? new ApiResponse { Code = "0", Message = "Data not found" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }
}
