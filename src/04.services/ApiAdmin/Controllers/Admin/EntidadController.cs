using Common.Logs;
using DataAccess;
using Domain.Admin.Models;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace ApiAdmin.Controllers
{
    [Route("api/[controller]")]
    public class EntidadController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public EntidadController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            DbAccess _db = new DbAccess(_configuration);
            GenericResponse _resonse = new GenericResponse();
            try
            {
                await _db.SPExecute("App.Entidad_Get");
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _resonse = _db.GetDataTableAsync();

            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al listar entidades: \n" + ex.ToString());
                _resonse.Create("0", "Error al listar entidades");
            }
            finally
            {

            }
            return Ok(_resonse);
        }

        [HttpPost("Insert")]
        public async Task<IActionResult> Post([FromBody] Entidad data)
        {
            DbAccess _db = new DbAccess(_configuration);
            GenericResponse _resonse = new GenericResponse();
            try
            {
                await _db.SPExecute("App.Entidad_Insert");
                _db.AddDynamicParam("ruc", data.ruc);
                _db.AddDynamicParam("razonSocial", data.razonSocial);
                _db.AddDynamicParam("nombreComercial", data.nombreComercial);
                _db.AddDynamicParam("correo", data.correo);
                _db.AddDynamicParam("telefono", data.telefono);
                _db.AddDynamicParam("direccion", data.direccion);
                _resonse = _db.GetDefault();

            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al insertar entidad: \n" + ex.ToString());
                _resonse.Create("0", "Error al insertar entidad");
            }
            finally
            {

            }
            return Ok(_resonse);

        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(int id, [FromBody] Entidad data)
        {
            DbAccess _db = new DbAccess(_configuration);
            GenericResponse _resonse = new GenericResponse();
            try
            {
                await _db.SPExecute("App.Entidad_Update");
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("ruc", data.ruc);
                _db.AddDynamicParam("razonSocial", data.razonSocial);
                _db.AddDynamicParam("nombreComercial", data.nombreComercial);
                _db.AddDynamicParam("correo", data.correo);
                _db.AddDynamicParam("telefono", data.telefono);
                _db.AddDynamicParam("direccion", data.direccion);
                _resonse = _db.GetDefault();

            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al actualizar entidad: \n" + ex.ToString());
                _resonse.Create("0", "Error al actualizar entidad");
            }
            finally
            {

            }
            return Ok(_resonse);
        }

        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete(string id)
        {
            DbAccess _db = new DbAccess(_configuration);
            GenericResponse _resonse = new GenericResponse();
            try
            {
                await _db.SPExecute("App.Entidad_Delete");
                _db.AddDynamicParam("id", id);
                _resonse = _db.GetDefault();

            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al eliminar entidad: \n" + ex.ToString());
                _resonse.Create("0", "Error al eliminar entidad");
            }
            finally
            {

            }
            return Ok(_resonse);
        }
    }
}
