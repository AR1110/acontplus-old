using Common.AppSettings.Extensions;
using Microsoft.AspNetCore.Mvc;
using Restaurant.API.Interfaces;
using Services.Common.Extensions;


namespace Restaurant.API.Controllers
{
    public class ConfigPrinterController(IConsumptionConfigService configService) : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var response =
                await configService.GetPrinterAsync(
                    new Dictionary<string, object> { { "idRol", User.GetUserRoleId() } });
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Post(bool estado)
        {
            var response = await configService.AddPrinterAsync(
                new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "estado", estado } });
            return Ok(response);
        }
    }
}
