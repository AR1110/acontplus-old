using Asp.Versioning;
using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Contabilidad.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace Contabilidad.API.Controllers.v1
{
    [ApiController]
    [Route("api/CuentaPorCobrar/")]
    [ApiVersion("1.0")]
    public class CuentaPorCobrarController : ControllerBase
    {
        private readonly ICuentaPorCobrarService _service;
        private readonly LogWriter _log;

        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;

        public CuentaPorCobrarController(ICuentaPorCobrarService service, LogWriter log, IConfiguration configuration)
        {
            _service = service;
            _log = log;
            _configuration = configuration;
            _db = new DbAccess(configuration);
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
                var response = await _service.GetAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en get Cuenta Por Cobrar " + ex.Message);
                return BadRequest("Error en get Cuenta Por Cobrar" + ex.Message);
            }
        }

        //[HttpPost("Insert/Cuota")]
        //public async Task<IActionResult> Insert([FromBody] ApiRequest paremeter)
        //{ 
        //    try
        //    { 
        //        var response = await _service.AddAsync(new Dictionary<string, object> {
        //            { "idUsuarioRol", User.GetUserRoleId() },
        //            { "json",  DataConverters.SerializeDictionary(paremeter.Data)
        //            }
        //        });
        //        if (response == null) { return BadRequest("Cant Save"); }
        //        return Ok(response);
        //    }
        //    catch (Exception ex)
        //    {
        //        _log.LogActivity("Error on Cuenta Por Cobrar -> Post: \n" + ex.ToString());
        //        return BadRequest(ex.Message);
        //    } 
        //}

        //[HttpPut("Update/Cuota")]
        //public async Task<IActionResult> Update([FromBody] ApiRequest paremeter)
        //{ 
        //    try
        //    {
        //        var response = await _service.UpdateAsync(new Dictionary<string, object> {
        //            { "idUsuarioRol", User.GetUserRoleId() },
        //            { "json",  DataConverters.SerializeDictionary(paremeter.Data)
        //            }
        //        });
        //        if (response == null) { return BadRequest("Cant Save"); }
        //        return Ok(response); 
        //    }
        //    catch (Exception ex)
        //    {
        //        _log.LogActivity("Error on Cuenta Por Cobrar -> Put: \n" + ex.ToString());
        //        return BadRequest(ex.Message);
        //    } 
        //} 

        [HttpPost("Insert/Cuota")]
        public async Task<IActionResult> Insert([FromBody] ApiRequest paremeter)
        {
            var _dbAccess = new DbAccess(_configuration);

            var _response = new ApiResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _dbAccess.SPExecute("Contabilidad.CuotaPorCobrar_Insert");
                _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _dbAccess.AddDynamicParam("json", DataConverters.SerializeDictionary(paremeter.Data));
                _response = _dbAccess.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Cuenta Por Cobrar -> Post: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Insertar las cuotas por cobrar");
            }
            finally
            {
                _dbAccess.Close();
            }
            return Ok(_response);
        }

        [HttpPut("Update/Cuota")]
        public async Task<IActionResult> Update([FromBody] ApiRequest paremeter)
        {
            var _dbAccess = new DbAccess(_configuration);

            var _response = new ApiResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _dbAccess.SPExecute("Contabilidad.CuotaPorCobrar_Update");
                _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _dbAccess.AddDynamicParam("json", DataConverters.SerializeDictionary(paremeter.Data));
                _response = _dbAccess.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Cuenta Por Cobrar -> Put: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar las Cuota por Cobrar");
            }
            finally
            {
                _dbAccess.Close();
            }
            return Ok(_response);
        }


    }
}
