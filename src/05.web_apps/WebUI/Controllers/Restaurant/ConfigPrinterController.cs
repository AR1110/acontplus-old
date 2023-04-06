using Common.Logs;
using DataAccess;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Restaurant
{
    public class ConfigPrinterController : Controller
    {
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly int _idRol;
        private readonly LogWriter _log;
        private readonly DbAccess _db;

        public ConfigPrinterController(IConfiguration config,
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
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Restaurant.ConfigPrinter_Get", parameters)));
        }
        [HttpPost]
        public async Task<IActionResult> Post(bool estado)
        {
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Restaurant.ConfigPrinter_Insert");
                _db.AddDynamicParam("idRol", _idRol);
                _db.AddDynamicParam("estado", estado);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error while saving config: \n" + ex.ToString());
                _response.Create(code: "0", "Error al guardar la configuración");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
