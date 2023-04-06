using Helpers;
using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Domain.Models;
using Common.Logs;

namespace WebUI.Controllers.Restaurant
{

    public class ConsumoTpvController : Controller
    {
        private readonly IConfiguration _config;
        private readonly IWebHostEnvironment _environment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly int _idRol;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        public ConsumoTpvController(IConfiguration config,
            IWebHostEnvironment environment,
                                    IHttpContextAccessor httpContextAccessor)
        {
            _config = config;
            _httpContextAccessor = httpContextAccessor;
            _environment = environment;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _db = new DbAccess(_config);
            _log = new LogWriter(_config);
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Report()
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
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Restaurant.ConsumoTpv_Get", parameters)));
        }
        [HttpPost]
        public async Task<IActionResult> Post(string json)
        {
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Restaurant.ConsumoTpv_Insert");
                _db.AddDynamicParam("idRol", _idRol);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error while saving consumo tpv: \n" + ex.ToString());
                _response.Create(code: "0", "Error al guardar el consumo");
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
                await _db.SPExecute("Restaurant.ConsumoTpv_Update");
                _db.AddDynamicParam("idRol", _idRol);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error while updating consumo tpv: \n" + ex.ToString());
                _response.Create(code: "0", "Error al actualizar el consumo");
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
                await _db.SPExecute("Restaurant.ConsumoTpv_Delete");
                _db.AddDynamicParam("idRol", _idRol);
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error while deleting consumo tpv: \n" + ex.ToString());
                _response.Create(code: "0", "Error al eliminar el consumo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpPost]
        public async Task<IActionResult> Print(int id)
        {
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Restaurant.ConsumoTpv_Print");
                _db.AddDynamicParam("idRol", _idRol);
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error while to print consumo tpv: \n" + ex.ToString());
                _response.Create(code: "0", "Error al imprimir el consumo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
