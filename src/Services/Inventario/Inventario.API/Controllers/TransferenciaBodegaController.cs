using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using Domain.Models.Inventario;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Inventario.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransferenciaBodegaController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public TransferenciaBodegaController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }


        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Inventario.TransferenciaBodega_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error on Get Search: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener las trans. a bodegas");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpGet("GetId")]
        public async Task<IActionResult> GetId(int id)
        {
            DbAccess _db = new DbAccess(_configuration);

            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Inventario.TransferenciaBodega_Get_Id");
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in GetId: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] TransferenciaBodegaParams data)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Inventario.TransferenciaBodega_Insert", true);
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("jsonHeader", SqlStringParam.Sanitize(data.header));
                _db.AddDynamicParam("jsonDetalle", SqlStringParam.Sanitize(data.detail));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error on Insert: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al insertar Trans. Bodega");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] TransferenciaBodegaParams data)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Inventario.TransferenciaBodega_Update", true);
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("jsonHeader", SqlStringParam.Sanitize(data.header));
                _db.AddDynamicParam("jsonDetalle", SqlStringParam.Sanitize(data.detail));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error on Update: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar Trans. Bodega");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Inventario.TransferenciaBodega_Delete");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error on Delete: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar Trans. Bodega");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

    }
}
