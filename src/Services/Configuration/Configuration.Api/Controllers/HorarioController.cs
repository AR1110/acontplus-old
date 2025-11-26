namespace Configuration.Api.Controllers;

public class HorarioController : BaseApiController
{
    private readonly IConfiguration _config;
    private readonly HorarioDao _h;

    public HorarioController(IConfiguration config)
    {
        _config = config;
        _h = new HorarioDao(_config);
    }


    [HttpGet("GetByTurno/{idTurno}")]
    public async Task<IActionResult> Get(int idTurno)
    {
        return Ok(await _h.ReadHorarioAsync(User.GetClaimValue<int>("userRoleId"), idTurno));
    }

    [HttpGet("GetDays")]
    public async Task<IActionResult> GetDays()
    {
        return Ok(await _h.ListDiaAsycn());
    }
}