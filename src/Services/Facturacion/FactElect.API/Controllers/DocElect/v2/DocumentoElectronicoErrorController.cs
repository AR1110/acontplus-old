namespace FactElect.API.Controllers.DocElect.v2;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
[ApiVersion("2.0")]
public class DocumentoElectronicoErrorController : ControllerBase
{
    private readonly IDocumentoElectronicoErrorService _factElect;


    public DocumentoElectronicoErrorController(IDocumentoElectronicoErrorService factElect)
    {
        _factElect = factElect;

    }


    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var parameters = new Dictionary<string, object> { { "id", id } };
        var orders = await _factElect.GetAsync(parameters);

        if ((orders == null) | string.IsNullOrEmpty(orders))
        {
            return NotFound();
        }

        return Ok(orders);
    }
}
