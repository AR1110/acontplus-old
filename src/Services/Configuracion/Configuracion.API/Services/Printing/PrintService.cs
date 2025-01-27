namespace Configuracion.API.Services.Printing;

public class PrintService(IAdoRepository repository) : IPrintService
{
    public async Task<string> GetAsync(Dictionary<string, object> parameters)
    {
        return await repository.SpExecuteDeprecatedAsync("Config.Print_Get", parameters);
    }
}
