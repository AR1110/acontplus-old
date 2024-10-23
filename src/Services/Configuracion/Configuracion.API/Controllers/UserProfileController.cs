namespace Configuracion.API.Controllers;

public class UserProfileController(IUserProfileService userProfileService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() } };
        var response = await userProfileService.GetAsync(parameters);
        if (response == null) { return NoContent(); }
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
            {
                { "id", id }, { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
            };
        var response = await userProfileService.UpdateAsync(parameters);
        if (response == null) { return NoContent(); }
        return Ok(response);
    }
}
