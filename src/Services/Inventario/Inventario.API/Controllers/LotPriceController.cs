namespace Inventario.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LotPriceController : ControllerBase
{
    private readonly ICustomLogger _log;
    private readonly ILotPriceService _service;

    public LotPriceController(ILotPriceService service, ICustomLogger log)
    {
        _service = service;
        _log = log;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse>> Get(string json)
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
            _log.LogActivity("Error en get Precio Masivo" + ex.Message + '\n' + json);
            return BadRequest("Error en get Precio Masivo " + ex.Message);
        }
    }

    [HttpPut]
    public async Task<ActionResult> Put(ApiRequest request)
    {
        try
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
            };
            var response = await _service.UpdateAsync(parameters);
            if (response == null) { return NoContent(); }

            ;
            return Ok(response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error en Put Precio Masivo" + ex.Message + "\n");
            return BadRequest("Error en Actualizar Precio Masivo " + ex.Message);
        }
    }
}
