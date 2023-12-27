using Azure.Core;
using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Compras.API.Interfaces;
using Compras.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace Compras.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompraNoHabitualController : ControllerBase
    {
        private IConfiguration _configuration;
        private ICompraNoHabitualService _compraNoHabSvc;
        private LogWriter _log;

        public CompraNoHabitualController(IConfiguration configuration, ICompraNoHabitualService compraNoHabSvc, LogWriter log)
        {
            _configuration = configuration;
            _compraNoHabSvc = compraNoHabSvc;
            _log = log;

        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var response = await _compraNoHabSvc.GetAsync(new Dictionary<string, object> {
                    { "userRoleId", User.GetUserRoleId() },
                    { "json", SqlStringParam.Sanitize(json) }
                });
                if (response == null) { return NoContent(); };
                return Ok(new { code = "1", payload = response });
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al listar Compra No Habitual: \n" + ex.ToString());
                return BadRequest("Error on get: " + ex.Message);
            }
        }

        [HttpPost("Insert")]
        public async Task<IActionResult> Insert(ApiRequest request)
        {
            request.UserRoleId = User.GetUserRoleId();
            try
            {
                var response = await _compraNoHabSvc.AddAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al crear compra no habitual: " + ex.ToString());
                return BadRequest(ex.Message);
            }
        }

        //[HttpGet("GetId/{id}")]
        //public async Task<IActionResult> GetId(int id)
        //{
        //    try
        //    {
        //        var response = await _compraNoHabSvc.GetByIdAsync(new Dictionary<string, object> {
        //            { "userRoleId", User.GetUserRoleId() },
        //            { "id", id }
        //        });
        //        if (response == null) { return NoContent(); };
        //        return Ok(new { code = "1", payload = response });
        //    }
        //    catch (Exception ex)
        //    {
        //        _log.LogActivity("Error al obtener datos de Compra No Habitual: \n" + ex.ToString());
        //        return BadRequest("Error on get by id: " + ex.Message);
        //    }
        //}

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, ApiRequest request)
        {
            request.UserRoleId = User.GetUserRoleId();
            try
            {
                var response = await _compraNoHabSvc.UpdateAsync(id, request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al actualizar compra no habitual: " + ex.ToString());
                return BadRequest(ex.Message);
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var parameters = new Dictionary<string, object>{
                    {"userRoleId", User.GetUserRoleId()},
                    {"id", id}
                };
                var response = await _compraNoHabSvc.DeleteAsync(parameters);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al eliminar doc. compra no habitual: " + ex.ToString());
                return BadRequest(ex.Message);
            }
        }

    }
}
