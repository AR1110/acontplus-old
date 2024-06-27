using FactElect.API.Interfaces;

namespace FactElect.API.Controllers;

public class DocumentoElectronicoErrorController : BaseApiController
{
    private readonly IDocumentoElectronicoErrorService _docElect;


    public DocumentoElectronicoErrorController(IDocumentoElectronicoErrorService docElect)
    {
        _docElect = docElect;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var parameters = new Dictionary<string, object> { { "id", id } };
        var orders = await _docElect.GetAsync(parameters);

        if ((orders == null) | string.IsNullOrEmpty(orders))
        {
            return NotFound();
        }

        return Ok(orders);
    }
}
