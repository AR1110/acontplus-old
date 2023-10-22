using DataAccess.Administracion;
using Domain.Models.Administracion;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Admin
{
    public class AccesoController : Controller
    {
        private AccesoDao _a;
        private readonly IConfiguration _configuration;
        public AccesoController(IConfiguration configuration)
        {
            _configuration = configuration;
            _a = new AccesoDao(_configuration);
        }
        // GET: Acceso

        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Get(int idPolitica)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _a.GetByPoliticaAsync(idRol, idPolitica);
            return Ok(res);
        }

        [HttpPost]
        public async Task<IActionResult> Put([FromBody] List<Acceso> data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _a.UpdateAsync(idRol, data);
            return Ok(res);
        }

        public async Task<IActionResult> GetAccesoBySubMenu(int idSubMenu)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _a.GetByAccessAsync(idRol, idSubMenu);
            return Ok(res);
        }

    }
}