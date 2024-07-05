namespace FactElect.API.Controllers;

public class DocumentoElectronicoErrorController(IDocumentoElectronicoErrorService docElect) : BaseApiController
{
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var parameters = new Dictionary<string, object> { { "id", id } };
        var orders = await docElect.GetAsync(parameters);

        if ((orders == null) | string.IsNullOrEmpty(orders))
        {
            return NotFound();
        }

        return Ok(orders);
    }
}
