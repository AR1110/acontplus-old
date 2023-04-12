using DataAccess;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.FE
{
    public class NotificacionTributariaController : Controller
    {

        // GET: Articulo
        private readonly IConfiguration _configuration;
         ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        
        GenericResponse _gr = new();        

        public NotificacionTributariaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            
            

        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("json", json);
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("FactElect.Notificacion_Tributaria_Get", parameters)));

        }

        [HttpPost]
        public async Task<IActionResult> Post(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", json);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("FactElect.Notificacion_Tributaria_Insert", parameters)));

        }

    }
}
