namespace Configuracion.API.Controllers;

public class PrintController(IPrintService printService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var response = await printService.GetAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        });
        if (response == null || string.IsNullOrEmpty(response)) { return BadRequest(); }

        return Ok(response);
    }
}
