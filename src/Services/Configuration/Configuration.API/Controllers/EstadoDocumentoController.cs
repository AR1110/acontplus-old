namespace Configuration.Api.Controllers;

public class EstadoDocumentoController(IEstadoDocumentoService estadoDocumento) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var response = await estadoDocumento.GetAsync(json);
        return response.Code == "1" ? Ok(response) : BadRequest("No data");
    }
}
