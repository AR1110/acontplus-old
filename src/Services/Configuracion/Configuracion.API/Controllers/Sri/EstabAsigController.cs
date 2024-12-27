using Common.AppSettings.Extensions;

namespace Configuracion.API.Controllers.Sri;

public class EstabAsigController(IEstablecimientoAsignacionService establecimientoAsignacionService)
    : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "json", json } };
        var response = await establecimientoAsignacionService.GetAsync(parameters);
        return Ok(response);
    }

    [HttpGet("GetDataForm")]
    public async Task<IActionResult> GetDataForm(string json)
    {
        var parameters = new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "json", json } };
        var response = await establecimientoAsignacionService.GetDataFormAsync(parameters);
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest request)
    {
        request.FromMobile = HttpContext.Items["FromMobile"] as bool? ?? false;
        request.UserRoleId = User.GetUserRoleId();
        var response = await establecimientoAsignacionService.AddAsync(request);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "id", id } };
        var response = await establecimientoAsignacionService.UpdateAsync(parameters);
        return Ok(response);
    }
}
