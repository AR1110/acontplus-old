using Common.Logs;
using DataAccess;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Restaurant
{

    public class ConsumoAnuladoTpvController : Controller
    {
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly int _idRol;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        public ConsumoAnuladoTpvController(IConfiguration config,
                                    IHttpContextAccessor httpContextAccessor)
        {
            _config = config;
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _db = new DbAccess(_config);
            _log = new LogWriter(_config);
        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            DataAccessObject _dao = new DataAccessObject(_config);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Restaurant.ConsumoAnuladoTpv_Get", parameters)));
        }
        [HttpPost]
        public async Task<IActionResult> Post(string json)
        {
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Restaurant.ConsumoAnuladoTpv_Insert");
                _db.AddDynamicParam("idRol", _idRol);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error while saving consumo anulado tpv: \n" + ex.ToString());
                _response.Create(code: "0", "Error al guardar el consumo anulado");
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
                await _db.SPExecute("Restaurant.ConsumoAnuladoTpv_Update");
                _db.AddDynamicParam("idRol", _idRol);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error while updating consumo anulado tpv: \n" + ex.ToString());
                _response.Create(code: "0", "Error al actualizar el consumo anulado");
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
                await _db.SPExecute("Restaurant.ConsumoAnuladoTpv_Delete");
                _db.AddDynamicParam("idRol", _idRol);
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error while deleting consumo anulado tpv: \n" + ex.ToString());
                _response.Create(code: "0", "Error al eliminar el consumo anulado");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
