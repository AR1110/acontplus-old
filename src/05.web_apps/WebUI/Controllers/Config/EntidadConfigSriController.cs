using Helpers;
using DataAccess;
using Domain;
using Domain.Models;
using Domain.Models.ConfigEmpresa;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace WebUI.Controllers.Config
{
    [Route("apiCliente/[controller]")]
    [ApiController]
    public class EntidadConfigSriController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        
        
        private DataAccessObject _dao;
        private readonly ILogger<EntidadConfigSriController> _logger;
        public EntidadConfigSriController(ILogger<EntidadConfigSriController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            
        }


        [HttpGet]
        [Route("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Config.Sri_Get", parameters)));
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
            parameters.Add("nroContribuyente", config.nroContribuyente??"");
            parameters.Add("obligadoLlevarContabilidad", config.obligadoLlevarContabilidad);
            parameters.Add("actividad", config.actividad ?? "");
            parameters.Add("jsonNormativa", data.jsonDetail);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Config.Sri_Update", parameters)));
        }
    }
}
