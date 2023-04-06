using Helpers;
using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Domain.Models;
using Common.Logs;

namespace WebUI.Controllers.Restaurant
{

    public class ConfigTpvController : Controller
    {
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly int _idRol;
        private readonly LogWriter _log;
        private readonly DbAccess _db;
        public ConfigTpvController(IConfiguration config,
                                    IHttpContextAccessor httpContextAccessor)
        {
            _config = config;
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _log = new LogWriter(_config);
            _db = new DbAccess(_config);
        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            DataAccessObject _dao = new DataAccessObject(_config);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Restaurant.ConfigTpv_Get", parameters)));
        }
        [HttpPost]
        public async Task<IActionResult> Post(string json)
        {
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Restaurant.ConfigTpv_Insert");
                _db.AddDynamicParam("idRol", _idRol);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error while saving config tpv: \n" + ex.ToString());
                _response.Create(code: "0", "Error al guardar la configuración");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpPut]
        public async Task<IActionResult> Put(string json)
        {
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Restaurant.ConfigTpv_Update");
                _db.AddDynamicParam("idRol", _idRol);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error while updating config tpv: \n" + ex.ToString());
                _response.Create(code: "0", "Error al actualizar la configuración");
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
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Restaurant.ConfigTpv_Delete");
                _db.AddDynamicParam("idRol", _idRol);
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error while updating config tpv: \n" + ex.ToString());
                _response.Create(code: "0", "Error al actualizar la configuración");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
