using Common.Logs;
using DataAccess;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.FE
{

    public class CompraHabitualController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        private readonly int _idRol;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        public CompraHabitualController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _db = new DbAccess(_configuration);
            _log = new LogWriter(_configuration);
        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("FactElect.CompraHabitual_Get", parameters)));
        }
        [HttpPost]
        public async Task<IActionResult> Post(string json)
        {
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("FactElect.CompraHabitual_Insert");
                _db.AddDynamicParam("idRol", _idRol);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error while saving compra habiltual: \n" + ex.ToString());
                _response.Create(code: "0", "Error al guardar la compra habitual");
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
                await _db.SPExecute("FactElect.CompraHabitual_Update");
                _db.AddDynamicParam("idRol", _idRol);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error while updating compra habiltual: \n" + ex.ToString());
                _response.Create(code: "0", "Error al actualizar la compra habitual");
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
                await _db.SPExecute("FactElect.CompraHabitual_Delete");
                _db.AddDynamicParam("idRol", _idRol);
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error while deleting compra habiltual: \n" + ex.ToString());
                _response.Create(code: "0", "Error al eliminar la compra habitual");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
