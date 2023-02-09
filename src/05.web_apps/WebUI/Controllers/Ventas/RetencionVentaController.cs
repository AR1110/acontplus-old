using DataAccess.Ventas;
using Domain.ViewModels.Ventas;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Ventas
{
    public class RetencionVentaController : Controller
    {
        private readonly IConfiguration _configuration;

        private RetencionVentaDao _rv;
        public RetencionVentaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _rv = new RetencionVentaDao(_configuration);
        }

        [Authorize] 
        public IActionResult Index()
        {
            ViewData["idRol"] = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] RetencionVentaViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _rv.InsertAsync(idRol, data);
            return Ok(res);
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _rv.GetAsync(idRol, json);
            return Ok(res);
        }

        [HttpPut]
        public async Task<IActionResult> Put(int idRetencionVenta, [FromBody] RetencionVentaViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _rv.UpdateAsync(idRol, idRetencionVenta, data);
            return Ok(res);
        }

        public async Task<IActionResult> Delete(int idRetencionVenta)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _rv.DeleteAsync(idRol, idRetencionVenta);
            return Ok(res);

        }


        public async Task<IActionResult> GetId(int idRetencionVenta)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _rv.GetIdAsync(idRol, idRetencionVenta);
            return Ok(res);
        }
    }
}
