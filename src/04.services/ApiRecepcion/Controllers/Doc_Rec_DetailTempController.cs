using BL.Recepcion;
using Common.Logs;
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
        public Doc_Rec_DetailTempController(IConfiguration configuration) => (_configuration) = (configuration);

        [HttpGet("{idRol}/{idDocumento}")]
        public async Task<IActionResult> GetId(int idRol, int idDocumento)
        {
            LogWriter _logs = new LogWriter(_configuration);

            try
            {
                Dictionary<string, object> parameters = new Dictionary<string, object>();
                parameters.Add("idRol", idRol);
                parameters.Add("idDocumento", idDocumento);
                parameters.Add("jsonData", "");
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.GetDataTable("Recepcion.Doc_Detail_Temp_Get", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al obtener los detalles temporales: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al obtener los detalles temporales"
                });
            }
        }

        [HttpPost("{idRol}/{json}")]
        public async Task<IActionResult> Post(int idRol, string json)
        {
            LogWriter _logs = new LogWriter(_configuration);

            try
            {
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "idRol", idRol },
                    { "jsonData", SqlValidation.ValidateSqlString(json) }
                };
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.Default("Recepcion.Doc_Detail_Temp_Insert", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al insertar el detalle temporal: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al insertar el detalle"
                });
            }
        }

        [HttpPut("{idRol}/{json}")]
        public async Task<IActionResult> Put(int idRol, string json)
        {
            LogWriter _logs = new LogWriter(_configuration);

            try
            {
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "idRol", idRol },
                    { "jsonData", SqlValidation.ValidateSqlString(json) }
                };
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.Default("Recepcion.Doc_Detail_Temp_Update", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al actualizar el detalle temporal: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al actualizar el detalle"
                });
            }
        }
    }
}
