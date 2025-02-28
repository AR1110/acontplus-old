namespace Configuracion.API.Services.Printing;

public class PrintService(IAdoRepository repository) : IPrintService
{
    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        return await repository.SpExecuteAsync<ApiResponse>("Config.Print_Get", parameters);
    }
}
