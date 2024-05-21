namespace Configuracion.API.Services;

public class TurnoService : ITurnoService
{
    private readonly IADORepository _repository;

    public TurnoService(IADORepository respository)
    {
        _repository = respository;
    }

    public async Task<string> GetAsync(Dictionary<string, object> parameters)
    {
        var dt = await _repository.GetDataTableAsync("Config.Turno_Get", parameters);
        if (!DataValidation.DataTableIsNull(dt))
        {
            return DataConverters.DataTableToJSON(dt);
        }

        return null;
    }
}
