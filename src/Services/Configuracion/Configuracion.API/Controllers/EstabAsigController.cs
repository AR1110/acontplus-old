namespace Configuracion.API.Controllers;

public class EstabAsigController : BaseApiController
{
    private readonly IEstablecimientoAsignacionService _estab;
    private readonly ICustomLogger _log;

    public EstabAsigController(IEstablecimientoAsignacionService service, ICustomLogger log)
    {
        _estab = service;
        _log = log;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        try
        {
            var parameters = new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "json", json } };
            var response = await _estab.GetAsync(parameters);
            if (response == null) { return NoContent(); }

            return Ok(response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error in Get: \n" + ex);
            return BadRequest();
        }
    }

    [HttpGet("GetDataForm")]
    public async Task<IActionResult> GetDataForm(string json)
    {
        try
        {
            var parameters = new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "json", json } };
            var response = await _estab.GetDataFormAsync(parameters);
            if (response == null) { return NoContent(); }

            return Ok(response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error in Get Data Form: \n" + ex);
            return BadRequest();
        }
    }

    [HttpPost]
    public async Task<IActionResult> Insert([FromBody] ApiRequest request)
    {
        request.UserRoleId = User.GetUserRoleId();
        try
        {
            var response = await _estab.AddAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id)
    {
        try
        {
            var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "id", id } };
            var response = await _estab.UpdateAsync(parameters);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
