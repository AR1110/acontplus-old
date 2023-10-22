using DataAccess;
using Domain.Dtos;
using Lib.Common.Api;
using Lib.Common.DbUtils;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace ApiFactElect.Controllers.RetencionAts
{

    [Route("api/[controller]")]
    [ApiController]
    public class RetencionAtsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        public RetencionAtsController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
            _log = log;
        }
        [HttpGet("{json}")]
        public async Task<IActionResult> Get(string json)
        {

            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("FactElect.RetencionAts_Get");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al obtener la solicitud: " + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener la solicitud");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] RetencionAtsDto data)
        {

            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("FactElect.RetencionAts_Insert");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("infoCompRet", SqlStringParam.Sanitize(data.infoCompRet));
                _db.AddDynamicParam("docsSust", SqlStringParam.Sanitize(data.docsSust));
                _db.AddDynamicParam("impuestos", SqlStringParam.Sanitize(data.impuestos));
                _db.AddDynamicParam("retenciones", SqlStringParam.Sanitize(data.retenciones));
                if (!string.IsNullOrEmpty(data.reembolsos))
                {
                    _db.AddDynamicParam("reembolsos", SqlStringParam.Sanitize(data.reembolsos));
                }
                _db.AddDynamicParam("payments", SqlStringParam.Sanitize(data.payments));
                if (!string.IsNullOrEmpty(data.infoAdicional))
                {
                    _db.AddDynamicParam("infoAdicional", SqlStringParam.Sanitize(data.infoAdicional));
                }
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al guardar la retención: " + ex.ToString());
                _response.Create(code: "0", "Error al guardar la retención");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, RetencionAtsDto data)
        {

            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("FactElect.RetencionAts_Update");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("infoCompRet", SqlStringParam.Sanitize(data.infoCompRet));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al actualizar la retención: " + ex.ToString());
                _response.Create(code: "0", "Error al actualizar la retención");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpPut("Cancel/{id}")]
        public async Task<IActionResult> Cancel(int id)
        {

            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("FactElect.RetencionAts_Cancel");
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _response = _db.GetDefault();
                ;
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al anular la retención: " + ex.ToString());
                _response.Create(code: "0", "Error al anular la retención");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {

            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("FactElect.RetencionAts_Delete");
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al eliminar la retención: " + ex.ToString());
                _response.Create(code: "0", "Error al eliminar la retención");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
