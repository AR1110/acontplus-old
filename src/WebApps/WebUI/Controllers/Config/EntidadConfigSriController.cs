using DataAccess;
using Domain.Models;
using Lib.Common;
using Lib.Common.DbUtils;
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

        private DataAccessObject _dao;
        private readonly ILogger<EntidadConfigSriController> _logger;
        public EntidadConfigSriController(ILogger<EntidadConfigSriController> logger, IConfiguration configuration, LogWriter log)
        {
            _logger = logger;
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
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
            EntidadConfigSri config = JsonConvert.DeserializeObject<EntidadConfigSri>(data.jsonHeader);
            //List<Normativa> jsonNormativa = JsonConvert.DeserializeObject<List<Normativa>>(data.jsonDetail);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("id", id);
            parameters.Add("idAnioFiscal", config.idAnioFiscal);
            parameters.Add("idSubContribuyente", config.idSubContribuyente);
            parameters.Add("nroContribuyente", config.nroContribuyente ?? "");
            parameters.Add("obligadoLlevarContabilidad", config.obligadoLlevarContabilidad);
            parameters.Add("actividad", config.actividad ?? "");
            parameters.Add("jsonNormativa", data.jsonDetail);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Config.Sri_Update", parameters)));
        }
    }
}
