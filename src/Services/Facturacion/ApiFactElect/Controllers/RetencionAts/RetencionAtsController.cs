using DataAccess;
using Domain.Dtos;
using Helpers;
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
        public RetencionAtsController(IConfiguration configuration)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
        }
        [HttpGet("{json}")]
        public async Task<IActionResult> Get(string json)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("FactElect.RetencionAts_Get");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al obtener la solicitud: " + ex.ToString());
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
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("FactElect.RetencionAts_Insert");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("infoCompRet", SqlValidation.ValidateSqlString(data.infoCompRet));
                _db.AddDynamicParam("docsSust", SqlValidation.ValidateSqlString(data.docsSust));
                _db.AddDynamicParam("impuestos", SqlValidation.ValidateSqlString(data.impuestos));
                _db.AddDynamicParam("retenciones", SqlValidation.ValidateSqlString(data.retenciones));
                if (!string.IsNullOrEmpty(data.reembolsos))
                {
                    _db.AddDynamicParam("reembolsos", SqlValidation.ValidateSqlString(data.reembolsos));
                }
                _db.AddDynamicParam("payments", SqlValidation.ValidateSqlString(data.payments));
                if (!string.IsNullOrEmpty(data.infoAdicional))
                {
                    _db.AddDynamicParam("infoAdicional", SqlValidation.ValidateSqlString(data.infoAdicional));
                }
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al guardar la retención: " + ex.ToString());
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
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("FactElect.RetencionAts_Update");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("infoCompRet", SqlValidation.ValidateSqlString(data.infoCompRet));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al actualizar la retención: " + ex.ToString());
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
            LogWriter _logs = new LogWriter(_configuration);
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
                _logs.LogError("Error al anular la retención: " + ex.ToString());
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
            LogWriter _logs = new LogWriter(_configuration);
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
                _logs.LogError("Error al eliminar la retención: " + ex.ToString());
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
