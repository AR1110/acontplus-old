using DataAccess.Administracion;
using Domain.Models.Administracion;
using Lib.Common.Api;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Config
{
    public class MenuController : Controller
    {
        // GET: Menu
        private readonly IConfiguration _configuration;
        GenericResponse _gr = new();
        private MenuDao m;
        public MenuController(IConfiguration configuration)
        {
            _configuration = configuration;
            m = new MenuDao(_configuration);
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Menu data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await m.InsertAsync(idRol, data);
            return Ok(_gr);
        }
        public async Task<IActionResult> Get()
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await m.GetAsync(idRol);
            return Ok(_gr);
        }

        [HttpPost]
        public async Task<IActionResult> Put(int idMenu, [FromBody] Menu data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await m.UpdateAsync(idRol, idMenu, data);
            return Ok(_gr);
        }

        public async Task<IActionResult> Delete(int idMenu)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await m.DeleteAsync(idRol, idMenu);
            return Ok(_gr);
        }

        //OTHER METHODS
        public async Task<IActionResult> GetAccesos()
        {
            _gr = await m.GetAccesosAsync();
            return Ok(_gr);
        }


    }
}