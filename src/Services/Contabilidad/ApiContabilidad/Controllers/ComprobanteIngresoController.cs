using Services.Common.Logs;
using DataAccess;
using Domain.Dtos;
using Domain.Dtos.Contabilidad;
using Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Lib.Common;

namespace ApiContabilidad.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComprobanteIngresoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _dbAccess;
        public ComprobanteIngresoController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dbAccess = new DbAccess(_configuration);
        }

        // GET: api/<CuentaPorCobrarController>
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _dbAccess.SPExecute("Contabilidad.ComprobanteIngreso_Get");
                _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _dbAccess.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _dbAccess.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogError("Error on Comprobante Ingreso -> Get: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al traer los Comprobantes de Ingreso");
            }
            finally
            {
                _dbAccess.Close();
            }
            return Ok(_response);
        }

        [HttpPost("Insert")]
        public async Task<IActionResult> Insert([FromBody] RequestApiDto paremeter)
        {
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _dbAccess.SPExecute("Contabilidad.ComprobanteIngreso_Insert");
                _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _dbAccess.AddDynamicParam("json", Converters.SerializeDictionary(paremeter.data));
                _response = _dbAccess.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error on Comprobante Ingreso -> Insert: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al registrar los Comprobantes de Ingreso");
            }
            finally
            {
                _dbAccess.Close();
            }
            return Ok(_response);
        }

        [HttpPut("Cancel")]
        public async Task<IActionResult> Cancel([FromBody] RequestApiDto paremeter)
        {
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _dbAccess.SPExecute("Contabilidad.ComprobanteIngreso_Update_Cancel");
                _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _dbAccess.AddDynamicParam("json", Converters.SerializeDictionary(paremeter.data));
                _response = _dbAccess.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error on Comprobante Ingreso -> Cancel: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Cancelar los Comprobantes de Ingreso");
            }
            finally
            {
                _dbAccess.Close();
            }
            return Ok(_response);
        }
    }
}
