using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using Domain;
using Domain.Models.ConfigEmpresa;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Common.Logs;

namespace WebUI.Controllers.Config
{
    [Route("apiCliente/[controller]")]
    [ApiController]
    public class EntidadConfigSriController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;


        private readonly ILogger<EntidadConfigSriController> _logger;
        public EntidadConfigSriController(ILogger<EntidadConfigSriController> logger, IConfiguration configuration, LogWriter log)
        {
            _logger = logger;
            _configuration = configuration;

            _log = log;
        }


        [HttpGet]
        [Route("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            DbAccess _db = new DbAccess(_configuration);

            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Config.Sri_Get");
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in Get: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut]
        [Route("Put/{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ParamsRequesteViewModel data)
        {
            var response = new GenericResponse();
            try
            {
                EntidadConfigSri config = JsonConvert.DeserializeObject<EntidadConfigSri>(data.jsonHeader);

                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Config.Sri_Update");
                    _db.AddDynamicParam("id", id);
                    _db.AddDynamicParam("idAnioFiscal", config.idAnioFiscal);
                    _db.AddDynamicParam("idSubContribuyente", config.idSubContribuyente);
                    _db.AddDynamicParam("nroContribuyente", config.nroContribuyente ?? "");
                    _db.AddDynamicParam("obligadoLlevarContabilidad", config.obligadoLlevarContabilidad);
                    _db.AddDynamicParam("actividad", config.actividad ?? "");
                    _db.AddDynamicParam("jsonNormativa", data.jsonDetail);
                    response = _db.GetDefault();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
