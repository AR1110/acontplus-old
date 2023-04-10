using Common.Logs;
using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApiRecepcion.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class Doc_Rec_DetailTempController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        public Doc_Rec_DetailTempController(IConfiguration configuration)
        {
            _configuration = configuration;
            _db = new DbAccess(configuration);
        }

        [HttpGet("{idDocumento}")]
        public async Task<IActionResult> GetId(int idDocumento)
        {
            LogWriter _logs = new LogWriter(_configuration);
            var _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Recepcion.Doc_Detail_Temp_Get");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("idDocumento", idDocumento);
                _db.AddDynamicParam("jsonData", "");
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al obtener los detalles temporales: " + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener los detalles temporales");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost]
        public async Task<IActionResult> Post(string json)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Recepcion.Doc_Detail_Temp_Insert");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("jsonData", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al insertar el detalle temporal: " + ex.ToString());
                _response.Create(code: "0", message: "Error al insertar el detalle");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut]
        public async Task<IActionResult> Put(string json)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Recepcion.Doc_Detail_Temp_Update");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("jsonData", SqlValidation.ValidateSqlString(json)); 
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al actualizar el detalle temporal: " + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar el detalle");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
