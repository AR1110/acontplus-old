using DataAccess;
using Domain.Dtos;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace ApiConfig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioPermisoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        public UsuarioPermisoController(IConfiguration configuration)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
        }

        [HttpGet("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            LogWriter _log = new LogWriter(_configuration);
            var _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Config.UserPermission_Get");
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogError("Error  getting user permission: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error getting user permission");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut]
        public async Task<IActionResult> Put([FromBody] UsuarioPemisoDto data)
        {
            LogWriter _log = new LogWriter(_configuration);
            var _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Config.UserPermission_Update");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("jsonPermission", SqlValidation.ValidateSqlString(data.jsonPermission));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error  updating user permission: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error updating user permission");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }


        [HttpGet("CheckHasPermission/{json}")]
        public async Task<IActionResult> CheckHasPermission(string json)
        {
            LogWriter _log = new LogWriter(_configuration);
            var _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Config.UserPermission_CheckHasPermission");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error while checking permission user: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error while checking permission user");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);

        }


        //[HttpPost]
        //public async Task<IActionResult> Post(UsuarioPemisoDto data)
        //{
        //    LogWriter _log = new LogWriter(_configuration);
        //    var _response = new GenericResponse();
        //    try
        //    {
        //        int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
        //        await _db.SPExecute("Config.UserPermission_Update");
        //        _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
        //        _db.AddDynamicParam("jsonPermission", SqlValidation.ValidateSqlString(data.jsonPermission));
        //        _response = _db.GetDataTableAsync();
        //    }
        //    catch (Exception ex)
        //    {
        //        _log.LogError("Error  updating user permission: \n" + ex.ToString());
        //        _response.Create(code: "0", message: "Error updating user permission");
        //    }
        //    return Ok(_response);
        //}

    }
}
