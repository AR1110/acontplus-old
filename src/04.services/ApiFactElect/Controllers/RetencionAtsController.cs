using Common.Logs;
using DataAccess;
using Domain.Dtos;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApiFactElect.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RetencionAtsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public RetencionAtsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpGet("{idRol}/{json}")]
        public async Task<IActionResult> Get(int idRol, string json)
        {
            LogWriter _logs = new LogWriter(_configuration);
            try
            {
                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "idRol", idRol },
                    { "json", SqlValidation.ValidateSqlString(json) }
                };
                return Ok(await _dao.GetDataSet("FactElect.RetencionAts_Get", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al obtener la solicitud: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al obtener la solicitud"
                });
            }
        }
        [HttpPost("{idRol}")]
        public async Task<IActionResult> Post(int idRol, [FromBody] RetencionAtsDto data)
        {
            LogWriter _logs = new LogWriter(_configuration);
            try
            {
                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>();
                parameters.Add("idRol", idRol);
                parameters.Add("infoCompRet", SqlValidation.ValidateSqlString(data.infoCompRet));
                parameters.Add("docsSust", SqlValidation.ValidateSqlString(data.docsSust));
                parameters.Add("impuestos", SqlValidation.ValidateSqlString(data.impuestos));
                parameters.Add("retenciones", SqlValidation.ValidateSqlString(data.retenciones));
                if (!string.IsNullOrEmpty(data.reembolsos))
                {
                    parameters.Add("reembolsos", SqlValidation.ValidateSqlString(data.reembolsos));
                }
                parameters.Add("payments", SqlValidation.ValidateSqlString(data.payments));
                if (!string.IsNullOrEmpty(data.infoAdicional))
                {
                    parameters.Add("infoAdicional", SqlValidation.ValidateSqlString(data.infoAdicional));
                }
                return Ok(await _dao.Default("FactElect.RetencionAts_Insert", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al guardar la retención: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al guardar la retención"
                });
            }
        }
        [HttpPut("{idRol}/{id}")]
        public async Task<IActionResult> Put(int idRol, int id, Dictionary<string, object> data)
        {
            LogWriter _logs = new LogWriter(_configuration);
            try
            {
                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>();
                foreach (KeyValuePair<string, object> item in data)
                {
                    parameters.Add(item.Key, SqlValidation.ValidateSqlString(item.Value.ToString()));
                }
                parameters.Add("idRol", idRol);
                parameters.Add("id", id);
                return Ok(await _dao.Default("FactElect.RetencionAts_Update", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al actualizar la retención: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al actualizar la retención"
                });
            }
            
        }
        [HttpDelete("{idRol}/{id}")]
        public async Task<IActionResult> Delete(int idRol, int id)
        {
            LogWriter _logs = new LogWriter(_configuration);
            try
            {
                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>
            {
                { "id", id },
                { "idRol", idRol }
            };
                return Ok(await _dao.Default("FactElect.RetencionAts_Delete", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al eliminar la retención: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al eliminar la retención"
                });
            } 
        }
    }
}
