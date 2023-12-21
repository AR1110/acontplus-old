using Common.Core.Models;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Admin
{
    public class BancoController : Controller
    {
        private readonly IConfiguration _configuration;
        private BancoDao _b;
        public BancoController(IConfiguration configuration)
        {
            _configuration = configuration;
            _b = new BancoDao(_configuration);
        }


        // GET: Banco        

        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Banco data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _b.CreateBancoAsync(idRol, data);
            return Ok(res);
        }

        public async Task<IActionResult> Get(int pageIndex, int pageSize)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _b.ReadBanco(idRol, pageIndex, pageSize);
            return Ok(res);
        }
        [HttpPost]
        public async Task<IActionResult> Put([FromBody] Banco data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _b.UpdateBancoAsync(idRol, data);
            return Ok(res);
        }

        public async Task<IActionResult> Delete(int idBanco)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _b.DeleteBancoAsync(idRol, idBanco);
            return Ok(res);
        }


        //Get banco 
        public async Task<IActionResult> GetByAll()
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _b.GetByOptionAsync(idRol);
            return Ok(res);
        }

    }
}