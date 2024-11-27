namespace Compras.API.Controllers;

public class NotaCreditoController : BaseApiController
{
    private IConfiguration _configuration;
    private readonly ICustomLogger _log;
    private readonly INotaCreditoService _ncpSvc;

    public NotaCreditoController(IConfiguration configuration, INotaCreditoService ncpSvc, ICustomLogger log)
    {
        _configuration = configuration;
        _ncpSvc = ncpSvc;
        _log = log;
    }

    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        try
        {
            var response = await _ncpSvc.GetAsync(new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
            });
            if (response == null) { return NoContent(); }

            ;
            return Ok(new { code = "1", payload = response });
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al listar nota credito proveedor: \n" + ex);
            return BadRequest("Error on get: " + ex.Message);
        }
    }

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert(ApiRequest request)
    {
        request.UserRoleId = User.GetUserRoleId();
        try
        {
            var response = await _ncpSvc.AddAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al crear nota credito proveedor: " + ex);
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        try
        {
            var response =
                await _ncpSvc.GetByIdAsync(new Dictionary<string, object>
                {
                    { "userRoleId", User.GetUserRoleId() }, { "id", id }
                });
            if (response == null) { return NoContent(); }

            ;
            return Ok(new { code = "1", payload = response });
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al obtener datos de nota credito proveedor: \n" + ex);
            return BadRequest("Error on get by id: " + ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, ApiRequest request)
    {
        request.UserRoleId = User.GetUserRoleId();
        try
        {
            var response = await _ncpSvc.UpdateAsync(id, request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al actualizar nota credito proveedor: " + ex);
            return BadRequest(ex.Message);
        }
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "id", id } };
            var response = await _ncpSvc.DeleteAsync(parameters);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al eliminar doc. nota credito proveedor: " + ex);
            return BadRequest(ex.Message);
        }
    }
}
