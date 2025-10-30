namespace Purchases.Infrastructure.Persistence.Repositories;

public class ArticuloRepository(IAdoRepository adoRepository) : IArticuloRepository
{
    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("Recepcion.Articulo_Get", parameters);
        var dt = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return DataValidation.DataTableIsNull(dt)
            ? new SpResponse { Code = "0", Message = "Recurso no encontrado" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }
}
