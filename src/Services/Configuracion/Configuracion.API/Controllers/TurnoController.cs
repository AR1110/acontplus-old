namespace Configuracion.API.Controllers;

public class TurnoController(ITurnoRepository turnoRepository) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", json } };
        var response = await turnoRepository.GetAsync(parameters);
        if (response == null) return BadRequest("No Data");

        return Ok(response);
    }

    [HttpPost("Post")]
    public async Task<IActionResult> Post([FromBody] Turno data)
    {
        var userRoleId = User.GetClaimValue<int>("userRoleId");
        var res = await turnoRepository.CreateTurnoAsync(userRoleId, data);
        return Ok(res);
    }

    [HttpGet("Get")]
    public async Task<IActionResult> Get(int pageIndex, int pageSize)
    {
        var userRoleId = User.GetClaimValue<int>("userRoleId");
        var res = await turnoRepository.ReadTurnoAsync(userRoleId, pageIndex, pageSize);
        return Ok(res);
    }

    [HttpPost("Put")]
    public async Task<IActionResult> Put([FromBody] Turno data)
    {
        var userRoleId = User.GetClaimValue<int>("userRoleId");
        var res = await turnoRepository.UpdateTurnoAsync(userRoleId, data);
        return Ok(res);
    }

    [HttpPost("Delete")]
    public async Task<IActionResult> Delete(int idTurno)
    {
        var userRoleId = User.GetClaimValue<int>("userRoleId");
        var res = await turnoRepository.DeleteTurnoAsync(userRoleId, idTurno);
        return Ok(res);
    }
}
