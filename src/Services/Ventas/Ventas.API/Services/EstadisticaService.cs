using System.Data;

namespace Ventas.API.Services;

public interface IEstadisticaService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}

public class EstadisticaService(IAdoRepository adoRepository) : IEstadisticaService
{
    private const string ModuleName = "Ventas.Estadisticas_Dashboard_";

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters, withTableNames: false);
        var dt = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return DataValidation.DataTableIsNull(dt)
            ? new ApiResponse { Code = "0", Message = "Data not found" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }
}