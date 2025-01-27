using Common.AppSettings.Extensions;

namespace Common.API.Controllers;

public class WhatsappMessageController(IWhatsappMessageService whatsappMessageService) : BaseApiController
{
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "json", DataConverters.SerializeDictionary(data.Data) },
            { "fromMobile", HttpContext.Items["FromMobile"] as bool? ?? false }
        };
        return Ok(await whatsappMessageService.AddAsync(parameters));
    }
}
