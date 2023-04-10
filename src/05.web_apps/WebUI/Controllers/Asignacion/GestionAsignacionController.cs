using DataAccess.Asignaciones;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Asignacion
{
    public class GestionAsignacionController : Controller
    {
        private readonly IConfiguration _config;
        private GestionAsignacionesDao _gAsig;
        public GestionAsignacionController(IConfiguration config)
        {
            _config = config;
            _gAsig = new GestionAsignacionesDao(_config);
        }
        
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            return Ok(await _gAsig.GetAsync(idRol, json));
        }

    }
}
