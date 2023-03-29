using Common.Logs;
using DataAccess;
using Domain.Dtos;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApiFactElect.Controllers.RetencionAts
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
        [HttpGet("{json}")]
        public async Task<IActionResult> Get(string json)
        {
            LogWriter _logs = new LogWriter(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "idRol", idUsuarioRol },
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
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] RetencionAtsDto data)
        {
            LogWriter _logs = new LogWriter(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>();
                parameters.Add("idRol", idUsuarioRol);
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
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, RetencionAtsDto data)
        {
            LogWriter _logs = new LogWriter(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value); 
                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>();
                parameters.Add("idRol", idUsuarioRol);
                parameters.Add("id", id);
                parameters.Add("infoCompRet", SqlValidation.ValidateSqlString(data.infoCompRet));
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
        [HttpPut("Cancel/{id}")]
        public async Task<IActionResult> Cancel(int id)
        {
            LogWriter _logs = new LogWriter(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>
            {
                { "id", id },
                { "idUsuarioRol", idUsuarioRol }
            };
                return Ok(await _dao.Default("FactElect.RetencionAts_Cancel", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al anular la retención: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al anular la retención"
                });
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            LogWriter _logs = new LogWriter(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>
            {
                { "id", id },
                { "idRol", idUsuarioRol }
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
