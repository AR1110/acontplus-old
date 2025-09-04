namespace FactElect.Application.Services;

public class NotificacionTributariaService(IAdoRepository adoRepository) : INotificacionTributariaService
{
    private const string ModuleName = "FactElect.Notificacion_Tributaria_";

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Insert", parameters);
    }

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters);
        var dt = ds?.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return DataValidation.DataTableIsNull(dt)
            ? new SpResponse { Code = "0", Message = "Data not found" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }
}
