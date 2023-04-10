using Common.Logs;
using DataAccess;
using Domain.Dtos.Compras;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ApiCompras.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CompraNoHabitualController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        public CompraNoHabitualController(IConfiguration configuration)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
        }
        // GET: api/<CompraNoHabitualController>
        [HttpGet("{json}")]
        public async Task<IActionResult> Get(string json)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Compra.Documento_Ingreso_Get");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al obtener datos de Compra No Habitual: " + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener datos de Compra No Habitual");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ComprobanteDto data)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                 await _db.SPExecute("Compra.Documento_Ingreso_Insert");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("comprobante", SqlValidation.ValidateSqlString(data.comprobante));
                _db.AddDynamicParam("detalles", SqlValidation.ValidateSqlString(data.detalles));
                _db.AddDynamicParam("impuestos", SqlValidation.ValidateSqlString(data.impuestos));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al guardar datos de Compra No Habitual: " + ex.ToString());
                _response.Create(code: "0", message: "Error al guardar los datos de Compra No Habitual");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ComprobanteDto data)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Compra.Documento_Ingreso_Update");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("idDocumentoIngreso", id);
                _db.AddDynamicParam("Comprobante", SqlValidation.ValidateSqlString(data.comprobante));
                _db.AddDynamicParam("detalles", SqlValidation.ValidateSqlString(data.detalles));
                _db.AddDynamicParam("impuestos", SqlValidation.ValidateSqlString(data.impuestos));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al editar datos de Compra No Habitual: " + ex.ToString());
                _response.Create(code: "0", message: "Error al editar los datos de Compra No Habitual");
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
                await _db.SPExecute("Compra.Documento_Ingreso_Update_Cancel");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("idDocumentoIngreso", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al anular datos de Compra No Habitual: " + ex.ToString());
                _response.Create(code: "0", message: "Error al anular los datos de Compra No Habitual");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
