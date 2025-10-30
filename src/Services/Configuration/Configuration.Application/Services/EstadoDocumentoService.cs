namespace Configuration.Application.Services;

public class EstadoDocumentoService(IAdoRepository adoRepository) : IEstadoDocumentoService
{
    public async Task<SpResponse> GetAsync(string json)
    {
        var data = new SpResponse
        {
            Code = "0"
        };
        var estados = await adoRepository.QueryAsync<EstadoPago>("Gestion.EstadoDocumento_Get",
            new Dictionary<string, object> { { "json", json } });
        if (estados.Count > 0)
        {
            data.Code = "1";
            data.Payload = estados;
        }

        return data;
    }
}
