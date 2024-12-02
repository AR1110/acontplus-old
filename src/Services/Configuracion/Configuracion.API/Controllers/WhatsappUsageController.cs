using Common.AppSettings.Extensions;

namespace Configuracion.API.Controllers
{
    public class WhatsappUsageController(IWhatsappUsageService whatsappUsageService) : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var parameters = new Dictionary<string, object>
            {
                { "idUsuarioRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) },
            };
            return Ok(await whatsappUsageService.GetAsync(parameters));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ApiRequest data)
        {
            var parameters = new Dictionary<string, object>
            {
                { "idUsuarioRol", User.GetUserRoleId() },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
            };
            return Ok(await whatsappUsageService.AddAsync(parameters));
        }

        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
        {
            var parameters = new Dictionary<string, object>
            {
                { "idUsuarioRol", User.GetUserRoleId() },
                { "id", id },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
            };
            return Ok(await whatsappUsageService.UpdateAsync(parameters));
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var parameters = new Dictionary<string, object> { { "idUsuarioRol", User.GetUserRoleId() }, { "id", id }, };
            return Ok(await whatsappUsageService.UpdateAsync(parameters));
        }
    }
}
