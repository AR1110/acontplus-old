using Lib.Common.Api;
using Mechanical.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common;

namespace Mechanical.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleController : BaseApiController
    {
        private readonly IVehicleService _vehicleService;

        public VehicleController(IVehicleService vehicleService)
        {
            _vehicleService = vehicleService;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>{
                    { "userRoleId", User.GetUserRoleId()},
                    { "json", json}
                };
                var vehicles = await _vehicleService.GetAsync(parameters);
                if (vehicles == null | string.IsNullOrEmpty((string)vehicles)) { return NoContent(); }
                return Ok(vehicles);
            }
            catch (System.Exception)
            {
                return BadRequest("Error on get");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ApiRequest data)
        {
            try
            {
                var parameters = new Dictionary<string, object> {
                    { "userRoleId", User.GetUserRoleId() },
                    { "json", data }
                };
                var response = await _vehicleService.AddAsync(parameters);
                if (response == null | string.IsNullOrEmpty(response)) { return BadRequest("No se pudo guardar"); }
                return Ok(response);
            }
            catch (System.Exception)
            {
                return BadRequest("Error On Save");
            }
        }

        [HttpPut]
        public async Task<IActionResult> Put(int Id, [FromBody] ApiRequest data)
        {
            try
            {
                var parameters = new Dictionary<string, object> {
                    { "userRoleId", User.GetUserRoleId() },
                    { "id", Id  },
                    { "json", data }
                };
                var response = await _vehicleService.UpdateAsync(parameters);
                if (response == null | string.IsNullOrEmpty(response)) { return BadRequest("No se pudo Actualizar"); }
                return Ok(response);
            }
            catch (System.Exception)
            {
                return BadRequest("Error On Edit");
            }
        }

        [HttpDelete]
        public async Task<IActionResult> Put(int Id)
        {
            try
            {
                var parameters = new Dictionary<string, object> {
                    { "userRoleId", User.GetUserRoleId() },
                    { "id", Id  }
                };
                var response = await _vehicleService.DeleteAsync(parameters);
                if (response == null | string.IsNullOrEmpty(response)) { return BadRequest("No se pudo Eliminar"); }
                return Ok(response);
            }
            catch (System.Exception)
            {
                return BadRequest("Error On Delete");
            }
        }
    }
}
