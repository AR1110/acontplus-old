namespace Configuracion.Application.Services;

public class EstadoDocumentoService : IEstadoDocumentoService
{
    private readonly IAdoRepository _repository;

    public EstadoDocumentoService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<LegacySpResponse> GetAsync(string json)
    {
        var data = new LegacySpResponse();
        var estados = await _repository.QueryAsync<EstadoPago>("Gestion.EstadoDocumento_Get",
            new Dictionary<string, object> { { "json", json } });
        if (estados.Count > 0)
        {
            data.code = "1";
            data.data = estados;
        }

        return data;
    }
}
