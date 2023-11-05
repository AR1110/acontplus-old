using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers
{
    public class NotificacionController : Controller
    {
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0


        GenericResponse _gr = new();


        public NotificacionController(IConfiguration configuration)
        {
            _configuration = configuration;




        }


        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post(string json)
        {
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("App.Notificacion_Serv_Insert");
                    _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                    response = _db.GetDefault();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
