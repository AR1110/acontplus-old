using Common.AppSettings.Extensions;

namespace Contabilidad.API.Controllers;

public class ControlCajaController(IControlCajaService controlCajaService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };

        var response = await controlCajaService.GetAsync(parameters);
        if (response == null)
        {
            return NoContent();
        } 

        return Ok(response);
    }


    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        var response = await controlCajaService.AddAsync(parameters);
        if (response == null) { return NoContent(); }

        ;
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        var response = await controlCajaService.UpdateAsync(parameters);
        if (response == null) { return NoContent(); }

        ;
        return Ok(response);
    }
}
