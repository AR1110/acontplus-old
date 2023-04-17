using Common.Logs;
using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Restaurant
{
    public class ConfigPrinterController : Controller
    {
        private readonly IConfiguration _config;
        
        
        private readonly LogWriter _log;
        private readonly DbAccess _db;

        public ConfigPrinterController(IConfiguration config)
        {
            _config = config;
            
            
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
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Restaurant.ConfigPrinter_Get");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogError("Error in Get: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener los datos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpPost]
        public async Task<IActionResult> Post(bool estado)
        {
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Restaurant.ConfigPrinter_Insert");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
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
