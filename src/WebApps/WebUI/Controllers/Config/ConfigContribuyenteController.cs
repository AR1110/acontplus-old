using Common.Core.ViewModels.GestionTributaria;
using Common.Infrastructure.Repository.GestionTributaria;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Config
{
    public class ConfigContribuyenteController : Controller
    {
        private readonly IConfiguration _configuration;
        private ConfiguracionContribuyenteDao _cc;
        public ConfigContribuyenteController(IConfiguration configuration)
        {
            _configuration = configuration;
            _cc = new ConfiguracionContribuyenteDao(_configuration);
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ConfigContribuyenteViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _cc.InsertAsync(idRol, data);
            return Ok(res);
        }

        public async Task<IActionResult> Get()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _cc.GetAsync(idRol);
            return Ok(res);
        }

        [HttpPost]
        public async Task<IActionResult> Put(int idConfigContribuyente, [FromBody] ConfigContribuyenteViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _cc.PutAsycn(idRol, idConfigContribuyente, data);
            return Ok(res);
        }


        public async Task<IActionResult> Delete(int idConfigC)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _cc.DeleteAsync(idRol, idConfigC);
            return Ok(res);
        }


        public async Task<IActionResult> GetId(int idConfigContribuyente)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _cc.GetIdAsync(idRol, idConfigContribuyente);
            return Ok(res);
        }

    }
}
