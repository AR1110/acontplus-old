using Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DataAccess.Administracion;

namespace WebUI.Controllers
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
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _a.GetByPoliticaAsync(idRol, idPolitica);
            return Ok(res);
        }

        [HttpPost]
        public async Task<IActionResult> Put([FromBody] List<Acceso> data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _a.UpdateAsync(idRol, data);
            return Ok(res);
        }

        public async Task<IActionResult> GetAccesoBySubMenu(int idSubMenu)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _a.GetByAccessAsync(idRol, idSubMenu);
            return Ok(res);
        }

    }
}