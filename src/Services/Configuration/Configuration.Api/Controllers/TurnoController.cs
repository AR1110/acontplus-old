namespace Configuration.Api.Controllers;

public class TurnoController(ITurnoRepository turnoRepository) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
    {
      { "userRoleId", User.GetClaimValue<int>("userRoleId") },
      { "json", SqlStringParam.Sanitize(json) }
    };
        return Ok(await turnoRepository.GetAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Turno data)
    {
        var parameters = new Dictionary<string, object>
    {
      { "userRoleId", User.GetClaimValue<int>("userRoleId") },
      { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<Turno>(data)) }
    };

        return Ok(await turnoRepository.AddAsync(parameters));
    }

    // [HttpGet("Get")]
    // public async Task<IActionResult> Get(int pageIndex, int pageSize)
    // {
    //   var userRoleId = User.GetClaimValue<int>("userRoleId");
    //   var res = await turnoRepository.ReadTurnoAsync(userRoleId, pageIndex, pageSize);
    //   return Ok(res);
    // }

    [HttpPut]
    public async Task<IActionResult> Put(int id, [FromBody] Turno data)
    {
        var parameters = new Dictionary<string, object>
    {
      { "userRoleId", User.GetClaimValue<int>("userRoleId") },
      { "id", id },
      { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<Turno>(data)) }
    };

        return Ok(await turnoRepository.UpdateAsync(parameters));
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
    {
      { "userRoleId", User.GetClaimValue<int>("userRoleId") },
      { "idTurno", id }
    };
        return Ok(await turnoRepository.DeleteAsync(parameters));
    }
}
