namespace Compras.Infrastructure.Persistence.Repositories;

public class DatoAdicionalArticuloRepository(IAdoRepository adoRepository) : IDatoAdicionalArticuloRepository
{
    private const string ModuleName = "Recepcion.Dato_Adicional_Articulo_";

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Insert", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Delete", parameters);
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters, withTableNames: false);
        var dt = ds?.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return DataValidation.DataTableIsNull(dt) ? new ApiResponse { Code = "0", Message = "Data not found" } : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }
}
