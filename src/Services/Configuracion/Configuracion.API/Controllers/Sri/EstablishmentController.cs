namespace Configuracion.API.Controllers.Sri;

[ApiController]
[Route("api/[controller]")]
public class EstablishmentController : ControllerBase
{
    private readonly ICustomLogger _log;
    private readonly IEstablishmentService _service;

    public EstablishmentController(IEstablishmentService service, ICustomLogger log)
    {
        _service = service;
        _log = log;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        try
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
            };
            var response = await _service.GetAsync(parameters);
            if (response == null) { return NoContent(); }

            ;
            return Ok(response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error en get " + ex.Message);
            return BadRequest("Error en get " + ex.Message);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post(ApiRequest data)
    {
        try
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
            };
            var response = await _service.AddAsync(parameters);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error en Post " + ex.Message);
            return BadRequest("Error en Post " + ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, ApiRequest data)
    {
        try
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "id", id },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
            };
            var response = await _service.UpdateAsync(parameters);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error en Update User Customer " + ex.Message);
            return BadRequest("Error en Update User Customer " + ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "id", id } };
        var response = await _service.DeleteAsync(parameters);
        return Ok(response);
    }
}
