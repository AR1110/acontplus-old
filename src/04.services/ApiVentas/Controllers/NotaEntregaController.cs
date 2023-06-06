using Common.Logs;
using DataAccess;
using Domain.ViewModels;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace ApiVentas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotaEntregaController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public NotaEntregaController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Ventas.NotaEntrega_Get", true);
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al listar nota entregas: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al listar nota entregas");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost("Insert")]
        public async Task<IActionResult> Insert([FromBody] NotaEntregaViewModel data)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.NotaEntrega_Insert");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("jsonNotaEntrega", JsonConvert.SerializeObject(data.notaEntrega));
                _db.AddDynamicParam("jsonDetalle", JsonConvert.SerializeObject(data.detalle));
                _db.AddDynamicParam("infoAdicionalArticulo", data.infoAdicionalArticulo);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al insertar nota entrega: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al insertar nota de entrega");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] NotaEntregaViewModel data)
        {
            DbAccess _db = new DbAccess(_configuration);
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.NotaEntrega_Update");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("jsonNotaEntrega", JsonConvert.SerializeObject(data.notaEntrega));
                _db.AddDynamicParam("jsonDetalle", JsonConvert.SerializeObject(data.detalle));
                _db.AddDynamicParam("infoAdicionalArticulo", data.infoAdicionalArticulo);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error al actualizar nota entrega: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar la nota de entrega");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }


        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            DbAccess _db = new DbAccess(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.NotaEntrega_Delete");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al eliminar la factura: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar la fcatura");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
