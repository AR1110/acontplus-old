namespace FactElect.API.Controllers;

public class DocumentoElectronicoController(IDocumentoElectronicoService documentoElectronicoService)
    : BaseApiController
{
    private const string UserRoleId = "userRoleId";

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idRol", User.GetClaimValue<int>(UserRoleId) }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await documentoElectronicoService.GetAsync(parameters));
    }

    [HttpGet("GetByStatus")]
    public async Task<IActionResult> GetByStatus(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idRol", User.GetClaimValue<int>(UserRoleId) }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await documentoElectronicoService.GetByStatusAsync(parameters));
    }

    [HttpGet("GetDataForm")]
    public async Task<IActionResult> GetDataForm()
    {
        var parameters = new Dictionary<string, object> {
            { "idUsuarioRol", User.GetClaimValue<int>(UserRoleId)
            }
        };
        return Ok(await documentoElectronicoService.GetDataFormAsync(parameters));
    }

    [HttpGet("GetXmlSri/{id}")]
    public async Task<IActionResult> GetXmlSri(int id)
    {
        var parameters = new Dictionary<string, object> {
            { "idUsuarioRol", User.GetClaimValue<int>(UserRoleId) },
            { "id", id }
        };
        var response = await documentoElectronicoService.GetXmlSriAsync(parameters);
        if (response == null)
        {
            return BadRequest("No se encontro xml");
        }

        return File(response.Content, "text/xml", response.FileName);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id)
    {
        var parameters = new Dictionary<string, object> {
            { "userRoleId", User.GetClaimValue<int>(UserRoleId) },
            { "id", id }
        };
        return Ok(await documentoElectronicoService.UpdateAsync(parameters));
    }
}
