namespace Compras.API.Controllers;

public class DatoAdicionalArticuloController(IDatoAdicionalArticuloService datoAdicionalArticuloService)
    : BaseApiController
{
    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await datoAdicionalArticuloService.GetAsync(parameters));
    }

    [HttpPost("Insert/{id}")]
    public async Task<IActionResult> Insert(int id, ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() },
            { "idDocumento", id },
            { "json", DataConverters.SerializeDictionary(request.Data) }
        };
        return Ok(await datoAdicionalArticuloService.AddAsync(parameters));
    }

    [HttpDelete("Delete/{idInfoAdicional}")]
    public async Task<IActionResult> Delete(int idInfoAdicional)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() }, { "idInfoAdicional", idInfoAdicional },
        };
        return Ok(await datoAdicionalArticuloService.DeleteAsync(parameters));
    }
}
