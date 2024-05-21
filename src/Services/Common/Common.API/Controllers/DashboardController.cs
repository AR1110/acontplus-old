namespace Common.API.Controllers;

public class DashboardController(IDashboardService dashboard) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var response = await dashboard.GetAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(json ?? "") }
        });
        return Ok(response);
    }
}
