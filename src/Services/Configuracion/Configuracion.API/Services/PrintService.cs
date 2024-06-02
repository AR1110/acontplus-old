namespace Configuracion.API.Services;

public class PrintService : IPrintService
{
    private readonly IAdoRepository _repository;

    public PrintService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<string> GetAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteDeprecatedAsync("Config.Print_Get", parameters);
    }
}
