namespace Accounting.Api.Controllers;

public class AccountController(IAccountRepository accountService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await accountService.GetAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] AccountCreate accountDto)
    {
        var account = accountDto.Adapt<Account>();
        account.CreatedByUserId = User.GetUserId();

        return Ok(await accountService.AddAsync(account));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] AccountUpdate accountDto)
    {
        var account = accountDto.Adapt<Account>();
        account.UpdatedByUserId = User.GetUserId();

        return Ok(await accountService.UpdateAsync(id, account));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return Ok(await accountService.DeleteAsync(User.GetUserId(), id));
    }
}
