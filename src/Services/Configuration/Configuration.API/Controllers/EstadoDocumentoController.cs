namespace Configuration.API.Controllers;

public class EstadoDocumentoController(IEstadoDocumentoService estadoDocumento) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var response = await estadoDocumento.GetAsync(json);
        if (response.Code == "1") return Ok(response);

        return BadRequest("No data");
    }
}
