namespace Configuracion.API.Controllers;

public class WhatsappMessageController (IWhatsappMessageService whatsappMessageService): BaseApiController
{ 
    [HttpPost("Post")]
    public async Task<IActionResult> Post([FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>() 
        {
            {"idUsuarioRol",  User.GetUserRoleId()} ,
            {"json", DataConverters.SerializeDictionary(data.Data) }
        };
        return Ok(await whatsappMessageService.AddAsync(parameters));
    }

    [HttpPost("PostApp")]
    public async Task<IActionResult> PostApp([FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>()
        {
            {"idUsuarioRol",  User.GetUserRoleId()} ,
            {"json", DataConverters.SerializeDictionary(data.Data) }
        };
        return Ok(await whatsappMessageService.AddDeprecatedAsync(parameters));
    }
}
