using Common.AppSettings.Extensions;

namespace Compras.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FacturaCompraController : ControllerBase
{
    private IConfiguration _configuration;
    private readonly IFacturaCompraService _facturaCompraSvc;
    private readonly ICustomLogger _log;

    public FacturaCompraController(IConfiguration configuration, IFacturaCompraService facturaCompraSvc,
        ICustomLogger log)
    {
        _configuration = configuration;
        _facturaCompraSvc = facturaCompraSvc;
        _log = log;
    }

    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        try
        {
            var response = await _facturaCompraSvc.GetAsync(new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
            });
            if (response == null) { return NoContent(); }

            ;
            return Ok(new { code = "1", payload = response });
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al listar Factura Compra: \n" + ex);
            return BadRequest("Error on get: " + ex.Message);
        }
    }

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert(ApiRequest request)
    {
        request.UserRoleId = User.GetUserRoleId();
        try
        {
            var response = await _facturaCompraSvc.AddAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al crear factura compra: " + ex);
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        try
        {
            var response =
                await _facturaCompraSvc.GetByIdAsync(new Dictionary<string, object>
                {
                    { "userRoleId", User.GetUserRoleId() }, { "id", id }
                });
            if (response == null) { return NoContent(); }

            ;
            return Ok(new { code = "1", payload = response });
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al obtener datos de factuea Compra: \n" + ex);
            return BadRequest("Error on get by id: " + ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, ApiRequest request)
    {
        request.UserRoleId = User.GetUserRoleId();
        try
        {
            var response = await _facturaCompraSvc.UpdateAsync(id, request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al actualizar factura compra: " + ex);
            return BadRequest(ex.Message);
        }
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "id", id } };
            var response = await _facturaCompraSvc.DeleteAsync(parameters);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al anular doc. factura compra: " + ex);
            return BadRequest(ex.Message);
        }
    }
}
