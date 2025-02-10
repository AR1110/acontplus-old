using FactElect.API.Services.Logistica;

namespace FactElect.API.Controllers.Logistica;

public class GuiaRemisionController(IGuiaRemisionService service) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await service.GetAsync(parameters);
        if (response == null) { return NoContent(); }

        ;
        return Ok(response);
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "id", id } };
        var response = await service.GetByIdAsync(parameters);
        if (response == null) { return NoContent(); }

        ;
        return Ok(new { code = "1", payload = response });
    }

    [HttpPost]
    public async Task<IActionResult> Post(ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        var response = await service.AddAsync(parameters);
        return Ok(response);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        var response = await service.UpdateAsync(parameters);
        return Ok(response);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "id", id } };
        var response = await service.DeleteAsync(parameters);
        return Ok(response);
    }
}
