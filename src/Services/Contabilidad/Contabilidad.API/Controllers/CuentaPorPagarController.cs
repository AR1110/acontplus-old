using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Contabilidad.API.Dtos;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Contabilidad.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CuentaPorPagarController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _dbAccess;
        private readonly LogWriter _log;
        public CuentaPorPagarController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _dbAccess = new DbAccess(_configuration);
            _log = log;
        }

        // GET: api/<CuentaPorPagarController>
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {

            var _response = new ApiResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _dbAccess.SPExecute("Contabilidad.CuentaPorPagar_Get");
                _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _dbAccess.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _dbAccess.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Cuenta Por Pagar -> Get: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al traer las cuentas por pagar");
            }
            finally
            {
                _dbAccess.Close();
            }
            return Ok(_response);
        }

        // POST api/<CuentaPorPagarController>
        [HttpPost("{json}")]
        public async Task<IActionResult> Post(string json)
        {

            var _response = new ApiResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _dbAccess.SPExecute("Contabilidad.CuentaPorPagar_Insert");
                _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _dbAccess.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _dbAccess.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Cuenta Por Pagar -> Post: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al insertar las cuentas por pagar");
            }
            finally
            {
                _dbAccess.Close();
            }
            return Ok(_response);
        }

        // PUT api/<CuentaPorPagarController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, CuentaPorPagarDto data)
        {

            var _response = new ApiResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value); await _dbAccess.SPExecute("Contabilidad.CuentaPorPagar_Update");
                _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _dbAccess.AddDynamicParam("idCuentaPorPagar", id);
                _dbAccess.AddDynamicParam("json", SqlStringParam.Sanitize(data.cuotas));
                _response = _dbAccess.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Cuenta Por Pagar -> Put: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar las cuentas por pagar");
            }
            finally
            {
                _dbAccess.Close();
            }
            return Ok(_response);
        }
    }
}
