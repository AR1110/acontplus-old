namespace Configuracion.API.Controllers;

public class TurnoController(ITurnoRepository turnoSvc) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
            { { "idRol", User.GetClaimValue<int>("userRoleId") }, { "json", json } };
        var response = await turnoSvc.GetAsync(parameters);
        if (response == null) return BadRequest("No Data");

        return Ok(response);
    }

    [HttpPost("Post")]
    public async Task<IActionResult> Post([FromBody] Turno data)
    {
        var idRol = User.GetClaimValue<int>("userRoleId");
        var res = await turnoSvc.CreateTurnoAsync(idRol, data);
        return Ok(res);
    }

    [HttpGet("Get")]
    public async Task<IActionResult> Get(int pageIndex, int pageSize)
    {
        var idRol = User.GetClaimValue<int>("userRoleId");
        var res = await turnoSvc.ReadTurnoAsync(idRol, pageIndex, pageSize);
        return Ok(res);
    }

    [HttpPost("Put")]
    public async Task<IActionResult> Put([FromBody] Turno data)
    {
        var idRol = User.GetClaimValue<int>("userRoleId");
        var res = await turnoSvc.UpdateTurnoAsync(idRol, data);
        return Ok(res);
    }

    [HttpPost("Delete")]
    public async Task<IActionResult> Delete(int idTurno)
    {
        var idRol = User.GetClaimValue<int>("userRoleId");
        var res = await turnoSvc.DeleteTurnoAsync(idRol, idTurno);
        return Ok(res);
    }
}
