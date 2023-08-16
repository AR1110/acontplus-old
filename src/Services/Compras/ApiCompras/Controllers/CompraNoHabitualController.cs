using DataAccess;
using Domain.Dtos.Compras;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ApiCompras.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class CompraNoHabitualController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        public CompraNoHabitualController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
            _log = log;
        }
        // GET: api/<CompraNoHabitualController>
        [HttpGet("{json}")]
        public async Task<IActionResult> Get(string json)
        {
           
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
                _log.LogActivity("Error al obtener datos de Compra No Habitual: " + ex.ToString());
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
           
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Compra.Documento_Ingreso_Insert");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("comprobante", SqlValidation.ValidateSqlString(data.comprobante));
                _db.AddDynamicParam("detalles", SqlValidation.ValidateSqlString(data.detalles));
                _db.AddDynamicParam("impuestos", SqlValidation.ValidateSqlString(data.impuestos));
                _db.AddDynamicParam("artInfoAdicionales", SqlValidation.ValidateSqlString(data.artInfoAdicionales));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al guardar datos de Compra No Habitual: " + ex.ToString());
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
                _db.AddDynamicParam("artInfoAdicionales", SqlValidation.ValidateSqlString(data.artInfoAdicionales));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al editar datos de Compra No Habitual: " + ex.ToString());
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
                _log.LogActivity("Error al anular datos de Compra No Habitual: " + ex.ToString());
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
