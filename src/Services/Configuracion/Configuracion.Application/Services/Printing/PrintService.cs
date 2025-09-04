namespace Configuracion.Application.Services.Printing;

public class PrintService(IAdoRepository repository) : IPrintService
{
    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>("Config.Print_Get", parameters);
    }
}
