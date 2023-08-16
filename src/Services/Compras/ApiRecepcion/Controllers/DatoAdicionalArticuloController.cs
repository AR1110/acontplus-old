using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace ApiRecepcion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatoAdicionalArticuloController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public DatoAdicionalArticuloController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Recepcion.Dato_Adicional_Articulo_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                
                _log.LogActivity("Error al listar Familias: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al listar Familias");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost("Insert/{idDocumento}/{json}")]
        public async Task<IActionResult> Insert(int idDocumento, string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Recepcion.Dato_Adicional_Articulo_Insert");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("idDocumento", idDocumento);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                
                _log.LogActivity("Error al insertar dato adicional articulo: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al insertar dato adicional articulo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost("Delete/{idInfoAdicional}")]
        public async Task<IActionResult> Delete(int idInfoAdicional)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Recepcion.Dato_Adicional_Articulo_Delete");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("idInfoAdicional", idInfoAdicional);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                
                _log.LogActivity("Error al eliminar dato adicional articulo: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al dato adicional articulo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

    }
}
