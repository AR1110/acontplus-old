 
namespace Contabilidad.API.Controllers.v1;

[Route("api/[controller]")]
[ApiController]
public class ComprobanteIngresoController(IComprobanteIngresoService _svc) : ControllerBase
{  

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>{
            { "idUsuarioRol", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await _svc.GetAsync(parameters);
        if (response == null) { return NoContent(); }
        return Ok(new { code = "1", payload = response }); 
    }

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert([FromBody] ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) },
        };
        var response = await _svc.AddAsync(parameters); 

        return Ok(response);
    }

    [HttpPut("Cancel")]
    public async Task<IActionResult> Cancel(ApiRequest paremeter)
    {
        var parameters = new Dictionary<string, object> { 
            { "idUsuarioRol", User.GetUserRoleId() }, 
            { "json",  DataConverters.SerializeDictionary(paremeter.Data) } };
        var response = await _svc.CancelAsync(parameters);
        return Ok(response); 
    }


    [HttpPut]
    public async Task<IActionResult> Put(ApiRequest request)
    {
        var parameters = new Dictionary<string, object> {
            { "idUsuarioRol", User.GetUserRoleId() },
            { "json",  DataConverters.SerializeDictionary(request.Data) } };
        var response = await _svc.UpdateAsync(parameters);
        return Ok(response); 
    }
}
