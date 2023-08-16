using DataAccess;
using Domain.Dtos;
using Helpers;
using Lib.Common;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace ApiContabilidad.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComprobanteIngresoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _dbAccess;
        private readonly LogWriter _log;
        public ComprobanteIngresoController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _dbAccess = new DbAccess(_configuration);
            _log = log;
        }

        // GET: api/<CuentaPorCobrarController>
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            
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
                _log.LogActivity("Error on Comprobante Ingreso -> Get: \n" + ex.ToString());
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
            
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _dbAccess.SPExecute("Contabilidad.ComprobanteIngreso_Insert");
                _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _dbAccess.AddDynamicParam("json", SqlValidation.ValidateSqlString(Converters.SerializeDictionary(paremeter.data)));
                _response = _dbAccess.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Comprobante Ingreso -> Insert: \n" + ex.ToString());
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
                _log.LogActivity("Error on Comprobante Ingreso -> Cancel: \n" + ex.ToString());
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
