using DataAccess;
using Lib.Common;
using Lib.Common.DbUtils;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace ApiConfig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {


        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        public UsuarioController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
            _log = log;
        }

        [HttpGet("{json}")]
        public async Task<IActionResult> Get(string json)
        {

            var _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("App.Usuario_Get");
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while getting users: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error getting users");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }


        [HttpGet("Search/{json}")]
        public async Task<IActionResult> Search(string json)
        {

            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("App.Usuario_Get_Search");
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while searching users: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error searching users");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost("{json}")]
        public async Task<IActionResult> Post(string json)
        {

            var _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("App.Usuario_Insert");
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while insert users: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error insert users");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("{id}/{json}")]
        public async Task<IActionResult> Put(int id, string json)
        {

            var _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("App.Usuario_Update");
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while updating users: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error updating users");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {

            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("App.Usuario_Delete");
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while deleting users: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error deleting users");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

    }
}
