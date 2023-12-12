using Asp.Versioning;
using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Contabilidad.API.Controllers.v2
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]    
    [ApiVersion("2.0")]
    public class CuentaPorCobrarController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;

        public CuentaPorCobrarController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var _dbAccess = new DbAccess(_configuration);

            var _response = new GenericResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _dbAccess.SPExecute("Contabilidad.CuentaPorCobrar_Get");
                _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _dbAccess.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _dbAccess.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Cuenta Por Cobrar -> Get: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al traer las cuentas por cobrar");
            }
            finally
            {
                _dbAccess.Close();
            }
            return Ok(_response);
        }

        [HttpPost("Insert/Cuota")]
        public async Task<IActionResult> Insert([FromBody] ApiRequest paremeter)
        {
            var _dbAccess = new DbAccess(_configuration);

            var _response = new GenericResponse();
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

            var _response = new GenericResponse();
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
