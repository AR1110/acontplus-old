using Common.AppSettings.Extensions;
using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Restaurant.API.Interfaces;
using Services.Common.Extensions;

namespace Restaurant.API.Controllers
{
    public class ConsumoAnuladoTpvController(IConsumptionCancelledService cancelledService)
        : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var response = await cancelledService.GetAsync(new Dictionary<string, object>
            {
                { "idRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
            });
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Post(string json)
        {
            var response = await cancelledService.AddAsync(new Dictionary<string, object>
            {
                { "idRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
            });
            return Ok(response);
        }

        [HttpPut]
        public async Task<IActionResult> Put(string json)
        {
            var response = await cancelledService.UpdateAsync(new Dictionary<string, object>
            {
                { "idRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
            });

            return Ok(response);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var response =
                await cancelledService.DeleteAsync(
                    new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "id", id } });

            return Ok(response);
        }
    }
}
