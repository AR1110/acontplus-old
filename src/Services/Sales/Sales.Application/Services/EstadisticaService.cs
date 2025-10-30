namespace Sales.Application.Services;

public interface IEstadisticaService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
}

public class EstadisticaService(IAdoRepository adoRepository) : IEstadisticaService
{
    private const string ModuleName = "Ventas.Estadisticas_Dashboard_";

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters);
        var dt = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return DataValidation.DataTableIsNull(dt)
            ? new SpResponse { Code = "0", Message = "Data not found" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }
}
