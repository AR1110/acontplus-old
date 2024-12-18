using Common.AppSettings.Extensions;

namespace Contabilidad.API.Controllers
{
    public class AccountController(IAccountService accountService) : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string json)
        {
            var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
            return Ok(await accountService.GetAsync(parameters));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Account account)
        {
            account.UserId = User.GetUserId();
            return Ok(await accountService.AddAsync(account));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Account account)
        {
            account.UserId = User.GetUserId();
            return Ok(await accountService.UpdateAsync(id, account));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok(await accountService.DeleteAsync(User.GetUserId(), id));
        }
    }
}
