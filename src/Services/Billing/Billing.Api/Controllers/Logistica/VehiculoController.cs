namespace Billing.Api.Controllers.Logistica;

public class VehiculoController(IVehiculoService vehiculoService) : BaseApiController
{
    /*
     const json = {
        typeList: 0, --Lista Normal
        typeList: 1 => Para lISTAR EN SELECT HTML
        typeList: 2 => Para buscadores(autocomplete)
    }
     */
    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await vehiculoService.GetAsync(parameters));
    }

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert([FromBody] Vehiculo data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "placa", data.placa },
            { "marca", data.marca },
            { "modelo", data.modelo },
            { "observacion", data.observacion }
        };
        return Ok(await vehiculoService.AddAsync(parameters));
    }

    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Vehiculo data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "placa", data.placa },
            { "marca", data.marca },
            { "modelo", data.modelo },
            { "observacion", data.observacion }
        };
        return Ok(await vehiculoService.UpdateAsync(parameters));
    }

    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        return Ok(await vehiculoService.DeleteAsync(parameters));
    }


    [HttpGet("Search")]
    public async Task<IActionResult> Search(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await vehiculoService.SearchAsync(parameters));
    }
}
