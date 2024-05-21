namespace Configuracion.API.Controllers.Sri;

[Route("api/[controller]")]
[ApiController]
public class PtoEmiAsigController : ControllerBase
{
    private readonly ICustomLogger _log;
    private readonly IPuntoEmisionAsignacionService _service;

    public PtoEmiAsigController(IPuntoEmisionAsignacionService service, ICustomLogger log)
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
            _log.LogActivity("Error en get punto Emision Asignacion" + ex.Message);
            return BadRequest("Error en get " + ex.Message);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest data)
    {
        try
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
            };
            var response = await _service.AddAsync(parameters);
            if (response == null) { return NoContent(); }

            ;
            return Ok(response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error en Post Emision Asignacion" + ex.Message);
            return BadRequest("Error en Post Emision Asignacion" + ex.Message);
        }
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id)
    {
        try
        {
            var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "id", id } };
            var response = await _service.UpdateAsync(parameters);
            if (response == null) { return NoContent(); }

            ;
            return Ok(response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error en Put Emision Asignacion" + ex.Message);
            return BadRequest("Error en Actualizar Emision Asignacion" + ex.Message);
        }
    }
}
