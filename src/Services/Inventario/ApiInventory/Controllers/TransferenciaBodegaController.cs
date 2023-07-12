using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Services.Common.Logs;
using DataAccess;
using Domain.Models.Inventario;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace ApiInventory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransferenciaBodegaController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public TransferenciaBodegaController(IConfiguration configuration)
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
                await _db.SPExecute("Inventario.TransferenciaBodega_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error on Get Search: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener las trans. a bodegas");
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
                await _db.SPExecute("Inventario.TransferenciaBodega_Insert");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("jsonHeader", SqlValidation.ValidateSqlString(data.header));
                _db.AddDynamicParam("jsonDetalle", SqlValidation.ValidateSqlString(data.detail));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error on Insert: \n" + ex.ToString());
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
                _db.AddDynamicParam("jsonHeader", SqlValidation.ValidateSqlString(data.header));
                _db.AddDynamicParam("jsonDetalle", SqlValidation.ValidateSqlString(data.detail));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error on Update: \n" + ex.ToString());
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
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error on Delete: \n" + ex.ToString());
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