namespace FactElect.API.Controllers;

public class NotificacionTributariaController(INotificacionTributariaService notificacionTributariaService)
    : BaseApiController
{
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var parameters = new Dictionary<string, object> { { "id", id } };
        return Ok(await notificacionTributariaService.GetAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idRol", User.GetClaimValue<int>("userRoleId") }, { "json", DataConverters.SerializeDictionary(data.Data) }
        };
        return Ok(await notificacionTributariaService.AddAsync(parameters));
    }
}
