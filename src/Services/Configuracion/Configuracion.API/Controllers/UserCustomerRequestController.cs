using Common.AppSettings.Extensions;

namespace Configuracion.API.Controllers;

public class UserCustomerRequestController(IUserCustomerRequestService userCustomerRequestService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
            };
        var response = await userCustomerRequestService.GetAsync(parameters);
        if (response == null) { return NoContent(); }
        return Ok(response);
    }


    [HttpPost]
    public async Task<IActionResult> Post(ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
            };
        var response = await userCustomerRequestService.AddAsync(parameters);
        return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> Put(ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
            };
        var response = await userCustomerRequestService.UpdateAsync(parameters);
        if (response == null) { return NoContent(); }
        return Ok(response);
    }
}
