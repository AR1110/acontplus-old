namespace FactElect.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DocumentoElectronicoErrorController : ControllerBase
{
    private readonly IDocumentoElectronicoErrorService _docElect;
    private readonly ICustomLogger _log;

    public DocumentoElectronicoErrorController(IDocumentoElectronicoErrorService docElect, ICustomLogger log)
    {
        _docElect = docElect;
        _log = log;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        try
        {
            var parameters = new Dictionary<string, object> { { "id", id } };
            var orders = await _docElect.GetAsync(parameters);

            if ((orders == null) | string.IsNullOrEmpty(orders))
            {
                return NotFound();
            }

            return Ok(orders);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error on Get: \n" + ex);
            return BadRequest(ex.Message);
        }
    }
}
