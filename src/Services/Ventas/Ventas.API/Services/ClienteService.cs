namespace Ventas.API.Services;

public class ClienteService(IAdoSqlServer adoSqlServer) : IClienteService
{
    private const string ModuleName = "Ventas.Cliente_Get_";

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoSqlServer.GetDataSetAsync($"{ModuleName}Get", parameters, true);
        return !DataValidation.DataSetIsNull(ds)
            ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds, true) }
            : new ApiResponse { Code = "0", Message = "No se encontraron datos" };
    }

    public async Task<ApiResponse> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var dt = await adoSqlServer.GetDataTableAsync($"{ModuleName}Get_Id", parameters);
        return DataValidation.DataTableIsNull(dt)
            ? new ApiResponse { Code = "0", Message = "Data not found" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<ApiResponse> GetDataFormAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoSqlServer.GetDataSetAsync($"{ModuleName}Data_Form", parameters, true);
        return !DataValidation.DataSetIsNull(ds)
            ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds, true) }
            : new ApiResponse { Code = "0", Message = "No se encontraron datos" };
    }

    public async Task<ApiResponse> SearchAsync(Dictionary<string, object> parameters)
    {
        var dt = await adoSqlServer.GetDataTableAsync($"{ModuleName}Search", parameters);
        return DataValidation.DataTableIsNull(dt)
            ? new ApiResponse { Code = "0", Message = "Data not found" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }
}
