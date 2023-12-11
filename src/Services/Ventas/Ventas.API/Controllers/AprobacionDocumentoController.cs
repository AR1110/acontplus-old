using Common.Core.Models;
using Common.Core.Models.Ventas;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Ventas.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AprobacionDocumentoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public AprobacionDocumentoController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            var _response = new GenericResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Ventas.Aprob_Document_Get", true);
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al listar aprob. docs: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al listar aprob. docs.");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost("Insert")]
        public async Task<IActionResult> Insert(ApiRequest parameters)
        {
            var _response = new GenericResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                var userRoleId = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.Aprob_Document_Insert");
                _db.AddDynamicParam("userRoleId", userRoleId);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));                 
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al insertar aprob. doc.: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al insertar aprob. doc.");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Update(int id, ApiRequest parameters)
        {
            var _db = new DbAccess(_configuration);
            var _response = new GenericResponse();
            try
            {
                var userRoleId = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.Aprob_Document_Update");
                _db.AddDynamicParam("userRoleId", userRoleId);
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al actualizar aprob. doc: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar aprob. doc");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }


        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var _db = new DbAccess(_configuration);
            var _response = new GenericResponse();
            try
            {
                var userRoleId = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.Aprob_Document_Delete");
                _db.AddDynamicParam("idUsuarioRol", userRoleId);
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al eliminar la aprob. doc: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar aprob. doc");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpGet("GetId/{id}")]
        public async Task<IActionResult> GetId(int id)
        {
            var _db = new DbAccess(_configuration);
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.Aprob_Document_Get_Id");
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error in GetId: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }


    }
}
