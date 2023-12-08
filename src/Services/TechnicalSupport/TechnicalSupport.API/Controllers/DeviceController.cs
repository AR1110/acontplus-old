using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Services.Common;
using Services.Common.Logs;
using TechnicalSupport.API.Data;
using TechnicalSupport.API.Entities;
using TechnicalSupport.API.Interfaces;

namespace TechnicalSupport.API.Controllers
{
    public class DeviceController : BaseApiController
    {
        private readonly TechnicalSupportContext _context;
        private readonly LogWriter _log;
        private IDeviceService _deviceService;
        public DeviceController(TechnicalSupportContext context, LogWriter log, IDeviceService deviceService)
        {
            _context = context;
            _log = log;
            _deviceService = deviceService;
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"json", SqlStringParam.Sanitize(json)}
                };
                var response = await _deviceService.GetAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Get: " + ex.Message);
                return BadRequest("Error on get");
            }
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Device device)
        {
            try
            {
                if (_context.Products.Any(p => p.Name == device.Name))
                {
                    return BadRequest("Codigo Existente");
                }
                _context.Products.Add(device);
                await _context.SaveChangesAsync();
                return Ok(new { Message = "Registrado Exitosamente", Id = device.Id });
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Post: " + ex.Message);
                return BadRequest("Error on post");
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Device device)
        {
            try
            {
                if (id != device.Id)
                {
                    return BadRequest("El id no coincide");
                }
                var productFounded = await _context.Products.FindAsync(id);
                productFounded.Color = device.Color;
                productFounded.Name = device.Name;
                productFounded.Enabled = device.Enabled;
                _context.Update(productFounded);
                await _context.SaveChangesAsync();
                return Ok("Actualizado Exitosamente");
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Post: " + ex.Message);
                return BadRequest("Error on post");
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var device = await _context.Products.FindAsync(id);
                if (device == null)
                {
                    return NotFound();
                }

                device.Enabled = false;
                device.Deleted = true;
                _context.Entry(device).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok("Eliminado Exitosamente");
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Delete: " + ex.Message);
                return BadRequest("Error on Delete");
            }
        }
    }
}
