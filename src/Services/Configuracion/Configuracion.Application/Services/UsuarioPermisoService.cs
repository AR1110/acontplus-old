namespace Configuracion.Application.Services;

public interface IUsuarioPermisoService
{
    Task<ApiResponse> CheckAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}

public class UsuarioPermisoService(IAdoRepository adoRepository) : IUsuarioPermisoService
{
    private const string ModuleName = "Config.UserPermission_";

    public async Task<ApiResponse> CheckAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}CheckHasPermission", parameters);
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var dt = await adoRepository.GetDataTableAsync($"{ModuleName}Get", parameters);
        return DataValidation.DataTableIsNull(dt)
            ? new ApiResponse { Code = "0", Message = "Data not found" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Update", parameters);
    }
}
