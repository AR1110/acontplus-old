using Common.Core.Models;
using Common.Core.Utils;
using Mechanical.API.Interfaces;
using Mechanical.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace Mechanical.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleController : BaseApiController
    {
        private readonly IVehicleService _vehicleService;
        private readonly LogWriter _log;

        public VehicleController(IVehicleService vehicleService, LogWriter log)
        {
            _vehicleService = vehicleService;
            _log = log;
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
                if (vehicles == null | string.IsNullOrEmpty((string)vehicles))
                {
                    return NoContent();
                }
                return Ok(vehicles);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Get: \n" + ex.ToString());
                return BadRequest("Error on get");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ApiRequest data)
        {
            try

            // Es esto el controlller? si po que no lees ajaa vechiclecontroller
            {
                var parameters = new Dictionary<string, object> {
                    { "userRoleId", User.GetUserRoleId() },
                    { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data))}
                };
                var response = await _vehicleService.AddAsync(parameters);
                if (response == null | string.IsNullOrEmpty(response)) { return BadRequest("No se pudo guardar"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Post: \n" + ex.ToString());
                return BadRequest("Error On Save");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
        {
            try
            {
                var parameters = new Dictionary<string, object> {
                    { "userRoleId", User.GetUserRoleId() },
                    { "id", id  },
                    { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
                };
                var response = await _vehicleService.UpdateAsync(parameters);
                if (response == null | string.IsNullOrEmpty(response)) { return BadRequest("No se pudo Actualizar"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Put: \n" + ex.ToString());
                return BadRequest("Error On Edit");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                bool response = await _vehicleService.DeleteAsync(id);
                if (!response) { return BadRequest("No se pudo Eliminar"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on PutState: \n" + ex.ToString());
                return BadRequest("Error on Delete");
            }
        }

        [HttpPut("PutState/{id}/{state}")]
        public async Task<IActionResult> PutState(int id, bool state)
        {
            try
            {
                bool response = await _vehicleService.UpdateStateAsync(id, state);
                if (!response) { return BadRequest("No se pudo Actualizar"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on PutState: \n" + ex.ToString());
                return BadRequest("Error On PutState");
            }
        }
    }
}
