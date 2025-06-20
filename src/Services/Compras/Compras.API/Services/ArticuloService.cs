namespace Compras.API.Services;

public class ArticuloService(IAdoRepository adoRepository) : IArticuloService
{
    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("Recepcion.Articulo_Get", parameters, withTableNames: false);
        var dt = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return DataValidation.DataTableIsNull(dt)
            ? new ApiResponse { Code = "0", Message = "Recurso no encontrado" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }
}