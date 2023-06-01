
using Common.Logs;
using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace ApiAdmin.Controllers
{
    [Route("api/[controller]")]
    public class RolController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public RolController(IConfiguration config)
        {
            _configuration = config;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            DbAccess _db = new DbAccess(_configuration);
            GenericResponse _resonse = new GenericResponse();
            try
            {
                await _db.SPExecute("App.Rol_Get");
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _resonse = _db.GetDataTableAsync();

            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al listar roles: \n" + ex.ToString());
                _resonse.Create("0", "Error al listar roles");
            }
            finally
            {

            }
            return Ok(_resonse);
        }

        [HttpGet("GetId")]        
        public async Task<IActionResult> GetId(string json)
        {
            DbAccess _db = new DbAccess(_configuration);
            GenericResponse _resonse = new GenericResponse();
            try
            {
                await _db.SPExecute("App.Rol_GetId");
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _resonse = _db.GetDataTableAsync();

            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al listar rol: \n" + ex.ToString());
                _resonse.Create("0", "Error al listar rol");
            }
            finally
            {

            }
            return Ok(_resonse);
        }
    

        [HttpPost("Insert")]        
        public async Task<IActionResult> Insert(string json)
        {
            DbAccess _db = new DbAccess(_configuration);
            GenericResponse _resonse = new GenericResponse();
            try
            {
                await _db.SPExecute("App.Rol_Insert");
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _resonse = _db.GetDefault();

            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al insert rol: \n" + ex.ToString());
                _resonse.Create("0", "Error al insertar rol");
            }
            finally
            {

            }
            return Ok(_resonse);

        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(string id, string json)
        {
            DbAccess _db = new DbAccess(_configuration);
            GenericResponse _resonse = new GenericResponse();
            try
            {
                await _db.SPExecute("App.Rol_Update");
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _resonse = _db.GetDefault();

            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al actualizar rol: \n" + ex.ToString());
                _resonse.Create("0", "Error al actualizar rol");
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
                await _db.SPExecute("App.Rol_Delete");
                _db.AddDynamicParam("id", id);
                _resonse = _db.GetDefault();

            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al eliminar rol: \n" + ex.ToString());
                _resonse.Create("0", "Error al eliminar rol");
            }
            finally
            {

            }
            return Ok(_resonse);
        }

        [HttpPost("Duplicate")]
        public async Task<IActionResult> Duplicate(string id, string json)
        {
            DbAccess _db = new DbAccess(_configuration);
            GenericResponse _resonse = new GenericResponse();
            try
            {
                await _db.SPExecute("App.Rol_Duplicate");
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _resonse = _db.GetDefault();

            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al duplicar rol: \n" + ex.ToString());
                _resonse.Create("0", "Error al duplicar rol");
            }
            return Ok(_resonse);
        }
    }
}
