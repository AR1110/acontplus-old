using Common.Core.Models;
using Common.Core.Utils;
using Inventario.Core.Interfaces;
using Inventario.Infrastructure.Data; 
using Microsoft.AspNetCore.Mvc;
using Services.Common;

namespace Inventario.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticuloFraccionadoController : ControllerBase
    { 
        private readonly IArticuloFraccionadoService _artSvc;
        public ArticuloFraccionadoController(IArticuloFraccionadoService artSvc)
        { 
            _artSvc = artSvc;
        }
         
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        { 
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId() },
                    {"json", SqlStringParam.Sanitize(json)}
                };
                var response = await _artSvc.GetAsync(parameters);
                if (response == null) { return NoContent(); }
                return Ok(response);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        
        [HttpPost]
        public async Task<IActionResult> Post(ApiRequest request)
        {
            request.UserRoleId = User.GetUserRoleId();
            try
            {
                var response = await _artSvc.AddAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, ApiRequest request)
        { 
            try
            {
                request.UserRoleId = User.GetUserRoleId();
                var response = await _artSvc.UpdateAsync(id, request);
                return Ok(response);
            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId() },
                    {"id", id}
                };
                var response = await _artSvc.DeleteAsync(parameters);                
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
