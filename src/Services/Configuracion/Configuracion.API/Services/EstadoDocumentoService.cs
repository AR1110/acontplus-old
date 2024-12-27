using Common.AppSettings;
using Configuracion.API.Models;

namespace Configuracion.API.Services;

public class EstadoDocumentoService : IEstadoDocumentoService
{
    private readonly IAdoRepository _repository;

    public EstadoDocumentoService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<LegacyApiResponse> GetAsync(string json)
    {
        var data = new LegacyApiResponse();
        var estados = await _repository.DynamicListAsync<EstadoPago>("Gestion.EstadoDocumento_Get",
            new Dictionary<string, object> { { "json", SqlStringParam.Sanitize(json) } });
        if (estados.Count > 0)
        {
            data.code = "1";
            data.data = estados;
        }

        return data;
    }
}
