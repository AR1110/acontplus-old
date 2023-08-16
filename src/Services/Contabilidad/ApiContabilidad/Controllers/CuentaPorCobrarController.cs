using DataAccess;
using Domain.Dtos;
using Helpers;
using Lib.Common;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace ApiContabilidad.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CuentaPorCobrarController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public CuentaPorCobrarController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }

        // GET: api/<CuentaPorCobrarController>
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            DbAccess _dbAccess = new DbAccess(_configuration);
            
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _dbAccess.SPExecute("Contabilidad.CuentaPorCobrar_Get");
                _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _dbAccess.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
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
        public async Task<IActionResult> Insert([FromBody] RequestApiDto paremeter)
        {
            DbAccess _dbAccess = new DbAccess(_configuration);
            
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _dbAccess.SPExecute("Contabilidad.CuotaPorCobrar_Insert");
                _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _dbAccess.AddDynamicParam("json", Converters.SerializeDictionary(paremeter.data));
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
        public async Task<IActionResult> Update([FromBody] RequestApiDto paremeter)
        {
            DbAccess _dbAccess = new DbAccess(_configuration);
            
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _dbAccess.SPExecute("Contabilidad.CuotaPorCobrar_Update");
                _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _dbAccess.AddDynamicParam("json", Converters.SerializeDictionary(paremeter.data));
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
