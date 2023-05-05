using Common.Logs;
using DataAccess;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace ApiConfig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntidadConfigSriController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        public EntidadConfigSriController(IConfiguration configuration)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            LogWriter _log = new LogWriter(_configuration);
            var _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Config.Sri_Get");
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogError("Error al obtener EntidadConfigSri : \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener EntidadConfigSri");
            }
            return Ok(_response);
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ParamsRequesteViewModel data)
        {
            LogWriter _log = new LogWriter(_configuration);
            var _response = new GenericResponse();
            try
            {
                EntidadConfigSri config = JsonConvert.DeserializeObject<EntidadConfigSri>(data.jsonHeader);
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Config.Sri_Update");
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("idAnioFiscal", config.idAnioFiscal);
                _db.AddDynamicParam("idSubContribuyente", config.idSubContribuyente);
                _db.AddDynamicParam("nroContribuyente", config.nroContribuyente ?? "");
                _db.AddDynamicParam("obligadoLlevarContabilidad", config.obligadoLlevarContabilidad);
                _db.AddDynamicParam("actividad", config.actividad ?? "");
                _db.AddDynamicParam("jsonNormativa", data.jsonDetail);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error al actualizar EntidadConfigSri : \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar EntidadConfigSri");
            }
            return Ok(_response);
        }
    }
}
