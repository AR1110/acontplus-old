namespace Ventas.API.Services;

public interface IEmpleadoService
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> SearchAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}

public class EmpleadoService(IAdoSqlServer adoSqlServer) : IEmpleadoService
{
    private const string ModuleName = "Ventas.Empleado_";

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoSqlServer.SpExecuteAsync<ApiResponse>($"{ModuleName}Insert", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await adoSqlServer.SpExecuteAsync<ApiResponse>($"{ModuleName}Delete", parameters);
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var dt = await adoSqlServer.GetDataTableAsync($"{ModuleName}Get", parameters);
        return DataValidation.DataTableIsNull(dt)
            ? new ApiResponse { Code = "0", Message = "Data not found" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<ApiResponse> SearchAsync(Dictionary<string, object> parameters)
    {
        var dt = await adoSqlServer.GetDataTableAsync($"{ModuleName}Search", parameters);
        return DataValidation.DataTableIsNull(dt)
            ? new ApiResponse { Code = "0", Message = "Data not found" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await adoSqlServer.SpExecuteAsync<ApiResponse>($"{ModuleName}Update", parameters);
    }
}
