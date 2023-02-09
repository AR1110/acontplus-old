using DataAccess.ConfigEmpresa;
using Domain.Models.ConfigEmpresa;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Configuracion
{
    public class ConfigVentaDetalleController : Controller
    {
        private readonly IConfiguration _configuration;

        private ConfigVentaDetalleDao _cvd;
        public ConfigVentaDetalleController(IConfiguration configuration)
        {
            _configuration = configuration;
            _cvd = new ConfigVentaDetalleDao(_configuration);   
        }
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Get()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cvd.GetAsync(idRol);
            return Ok(res);
        }

        [HttpPut]
        public async Task<IActionResult> Put([FromBody] ConfigVentaDetalle data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cvd.UpdateAsync(idRol, data);
            return Ok(res);
        }
    }
}
