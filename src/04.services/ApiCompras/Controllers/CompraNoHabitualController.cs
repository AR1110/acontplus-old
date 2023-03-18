using Common.Logs;
using DataAccess;
using Domain.Dtos.Compras;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ApiCompras.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CompraNoHabitualController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public CompraNoHabitualController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        // GET: api/<CompraNoHabitualController>
        [HttpGet("{json}")]
        public async Task<IActionResult> Get(string json)
        {
            LogWriter _logs = new LogWriter(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object> {
                    {"idUsuarioRol", idUsuarioRol },
                    {"json", SqlValidation.ValidateSqlString(json)}
                };
                return Ok(await _dao.GetDataSet("Compra.Documento_Ingreso_Get", parameters));
            } catch (Exception ex)
            {
                _logs.LogError("Error al obtener datos de Compra No Habitual: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al obtener datos de Compra No Habitual"
                });

            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ComprobanteDto data)
        {
            LogWriter _logs = new LogWriter(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object> {
                    {"idUsuarioRol", idUsuarioRol },
                    {"comprobante", SqlValidation.ValidateSqlString(data.comprobante)},
                    {"detalles", SqlValidation.ValidateSqlString(data.detalles)},
                    {"impuestos", SqlValidation.ValidateSqlString(data.impuestos)}
                };
                return Ok(await _dao.Default("Compra.Documento_Ingreso_Insert", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al guardar datos de Compra No Habitual: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al guardar los datos de Compra No Habitual"
                });

            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ComprobanteDto data)
        {
            LogWriter _logs = new LogWriter(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object> {
                    {"idUsuarioRol", idUsuarioRol },
                    {"idDocumentoIngreso", id},
                    {"Comprobante", SqlValidation.ValidateSqlString(data.comprobante)},
                    {"detalles", SqlValidation.ValidateSqlString(data.detalles)},
                    {"impuestos", SqlValidation.ValidateSqlString(data.impuestos)}
                };
                return Ok(await _dao.Default("Compra.Documento_Ingreso_Update", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al editar datos de Compra No Habitual: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al editar los datos de Compra No Habitual"
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
                Dictionary<string, object> parameters = new Dictionary<string, object> {
                    {"idUsuarioRol", idUsuarioRol },
                    {"idDocumentoIngreso", id},
                };
                return Ok(await _dao.Default("Compra.Documento_Ingreso_Update_Cancel", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al anular datos de Compra No Habitual: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al anular los datos de Compra No Habitual"
                });

            }
        }
    }
}
