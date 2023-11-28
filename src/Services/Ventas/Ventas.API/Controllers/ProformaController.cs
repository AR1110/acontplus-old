using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using Domain.ViewModels.Ventas;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Common.Logs;

namespace Ventas.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProformaController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public ProformaController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            var _response = new GenericResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Ventas.Proforma_Get", true);
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al listar proformas: \n" + ex.ToString());
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
            var _response = new GenericResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.Proforma_Insert", true);
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("jsonProforma", JsonConvert.SerializeObject(data.proforma));
                _db.AddDynamicParam("jsonDetalle", JsonConvert.SerializeObject(data.detalle));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al insertar proforma: \n" + ex.ToString());
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
            var _db = new DbAccess(_configuration);

            var _response = new GenericResponse();
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
                _log.LogActivity("Error al actualizar nota entrega: \n" + ex.ToString());
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
            var _db = new DbAccess(_configuration);
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.Proforma_Delete", true);
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al eliminar proforma: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar proforma");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpGet("GetId/{id}")]
        public async Task<IActionResult> GetId(int id)
        {
            var _db = new DbAccess(_configuration);
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.Proforma_GetId");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al obtener datos del doc. proforma: \n" + ex.ToString());
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
