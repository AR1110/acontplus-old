namespace Configuracion.API.Controllers;

public class EstadoDocumentoController : BaseApiController
{
    private readonly IEstadoDocumentoService _estadoDoc;
    private readonly ICustomLogger _logWriter;

    public EstadoDocumentoController(IEstadoDocumentoService estadoDocumento, ICustomLogger log)
    {
        _estadoDoc = estadoDocumento;
        _logWriter = log;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        try
        {
            var response = await _estadoDoc.GetAsync(json);
            if (response.code == "1")
            {
                return Ok(response);
            }

            return BadRequest("No data");
        }
        catch (Exception ex)
        {
            _logWriter.LogActivity("Error on Get: " + ex);
            return BadRequest(ex.Message);
        }
    }
}
