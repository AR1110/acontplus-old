using DataAccess.Administracion;
using Domain.Models.Administracion;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Admin
{
    public class CargoController : Controller
    {
        private readonly IConfiguration _config;

        private CargoDao _c;
        public CargoController(IConfiguration config)
        {
            _config = config;
            _c = new CargoDao(_config);
        }

        public IActionResult Index()
        {
            return View();
        }
        public async Task<IActionResult> Get(string json)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _c.GetAsync(idRol, json);
            return Ok(res);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Cargo data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _c.InsertAsync(idRol, data);
            return Ok(res);
        }


        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] Cargo data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _c.UpdateAsync(idRol, id, data);
            return Ok(res);
        }

        public async Task<IActionResult> Delete(int id)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _c.DeleteAsync(idRol, id);
            return Ok(res);
        }
    }
}
