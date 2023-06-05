using Common.Logs;
using DataAccess;
using Domain.ViewModels.Ventas;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace ApiVentas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProformaController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public ProformaController(IConfiguration configuration)
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
                await _db.SPExecute("Ventas.Proforma_Get", true);
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al listar proformas: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al listar proformas");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost("Insert")]
        public async Task<IActionResult> Insert([FromBody] ProformaViewModel data)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.Proforma_Insert");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("jsonProforma", JsonConvert.SerializeObject(data.proforma));
                _db.AddDynamicParam("jsonDetalle", JsonConvert.SerializeObject(data.detalle));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al insertar proforma: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al insertar proforma");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProformaViewModel data)
        {
            DbAccess _db = new DbAccess(_configuration);
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.Proforma_Update");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("jsonProforma", JsonConvert.SerializeObject(data.proforma));
                _db.AddDynamicParam("jsonDetalle", JsonConvert.SerializeObject(data.detalle));
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
                await _db.SPExecute("Ventas.Proforma_Delete");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al eliminar proforma: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar proforma");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpDelete("GetId/{id}")]
        public async Task<IActionResult> GetId(int id)
        {
            DbAccess _db = new DbAccess(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.Proforma_GetId");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al obtener datos del doc. proforma: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener datos del doc. proforma");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
